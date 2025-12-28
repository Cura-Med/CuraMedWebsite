import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall3.css';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../features/modal/modalSlice.js';
import { useNavigate, useParams } from 'react-router-dom';
import { getChatToken, clearChatToken } from '../features/chat/chatSlice';
import axios from '../api/axios';

// =========================
// Agora + STT settings
// =========================
const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

// TEMP: backend doesn't return pubBotUid yet -> hardcode for now
// MUST match the pubBotUid your backend uses when calling Agora STT /join
const PUB_BOT_UID = 99002;

// STT settings (sent to backend /chats/join-text-to-speech)
const TRANSCRIBE_LANGS = ['en-US'];
const TRANSLATE_SOURCE = 'en-US';
const TRANSLATE_TARGETS = ['es-ES']; // EN -> ES

export default function VideoCall5() {
    const { callId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authUser = useSelector((s) => s.auth.user);
    const rtcTokenRaw = useSelector((s) => s.chat.token); // could be string or object

    const [channel, setChannel] = useState('');
    const [joined, setJoined] = useState(false);
    const [agentId, setAgentId] = useState(null);

    // ✅ transcript UI
    const [lastEn, setLastEn] = useState('');
    const [lastEs, setLastEs] = useState('');
    const [lines, setLines] = useState([]); // { ts, uid, en, es, rawText? }
    const [sttStatus, setSttStatus] = useState('idle'); // idle|starting|running|stopped|error
    const [sttError, setSttError] = useState('');

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localTracks = useRef({ videoTrack: null, audioTrack: null });

    const joiningRef = useRef(false);
    const agentStartingRef = useRef(false);

    // UI toggles
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [screenOn, setScreenOn] = useState(false);

    // Require auth
    useEffect(() => {
        if (!authUser?.id || authUser.id.length < 1) {
            dispatch(openAuthModal());
            navigate('/');
        }
    }, [authUser, dispatch, navigate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            void fullLeave();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Normalize rtc token (backend may return { token } or raw string)
    const rtcToken = (() => {
        if (typeof rtcTokenRaw === 'string') return rtcTokenRaw;
        if (!rtcTokenRaw) return null;
        return (
            rtcTokenRaw.token ||
            rtcTokenRaw.rtcToken ||
            rtcTokenRaw.data?.token ||
            rtcTokenRaw.data?.rtcToken ||
            null
        );
    })();

    const generateChannel = () => {
        const ch = String(callId || '').trim();
        setChannel(ch);
        console.log('[RTC] Channel:', ch);
        return ch;
    };

    const startCall = async () => {
        const ch = channel || generateChannel();
        if (!ch) return;
        setChannel(ch);

        // clear previous transcript
        setLastEn('');
        setLastEs('');
        setLines([]);
        setSttStatus('idle');
        setSttError('');

        await dispatch(getChatToken(ch));
    };

    // Join when token arrives
    useEffect(() => {
        if (!joined && !joiningRef.current && channel && typeof rtcToken === 'string' && rtcToken.length > 0) {
            joiningRef.current = true;
            joinAndPublish()
                .catch((e) => console.error('[RTC] joinAndPublish failed:', e))
                .finally(() => {
                    joiningRef.current = false;
                });
        } else if (channel && rtcTokenRaw && !rtcToken) {
            console.warn('[RTC] Token exists but we failed to extract a string. rtcTokenRaw=', rtcTokenRaw);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rtcToken, rtcTokenRaw, channel]);

    const bindRtcEvents = () => {
        // clean old handlers
        client.off('user-published');
        client.off('user-unpublished');
        client.off('user-joined');
        client.off('user-left');
        client.off('stream-message');

        client.on('user-published', async (remoteUser, mediaType) => {
            try {
                await client.subscribe(remoteUser, mediaType);
                if (mediaType === 'video') remoteUser.videoTrack?.play(remoteVideoRef.current);
                if (mediaType === 'audio') remoteUser.audioTrack?.play();
            } catch (e) {
                console.error('[RTC] subscribe failed', e);
            }
        });

        client.on('user-unpublished', () => {});

        client.on('user-joined', (u) => console.log('[RTC] user-joined:', u?.uid));
        client.on('user-left', (u) => console.log('[RTC] user-left:', u?.uid));

        /**
         * ✅ STT results arrive as RTC "stream-message" from the bot UID (pubBotUid).
         * NOTE: These logs show in the BROWSER DevTools console (not your terminal).
         */
        client.on('stream-message', async (uid, payload /* Uint8Array */) => {
            // DEBUG: show that *something* is arriving, regardless of uid.
            console.log('[STT raw] uid=', uid, 'bytes=', payload?.length);

            // Actual STT packets should come from the pub bot uid
            if (String(uid) !== String(PUB_BOT_UID)) return;

            try {
                const text = await gunzipToText(payload);

                // If backend did NOT set enableJsonProtocol=true, this is often NOT JSON -> JSON.parse will fail.
                let obj;
                try {
                    obj = JSON.parse(text);
                } catch {
                    setSttStatus('error');
                    setSttError(
                        'Received subtitle payload but it is not JSON. Backend STT join likely did not set rtcConfig.enableJsonProtocol=true (or payload is Protobuf).'
                    );
                    // keep a short sample for debugging
                    setLines((prev) => {
                        const next = [...prev, { ts: Date.now(), uid: String(uid), en: '', es: '', rawText: text?.slice?.(0, 200) || '' }];
                        return next.length > 200 ? next.slice(next.length - 200) : next;
                    });
                    console.warn('[STT] non-JSON payload sample:', text?.slice?.(0, 200));
                    return;
                }

                const en = pickEnglish(obj);
                const es = pickTranslation(obj, 'es-ES');

                if (en) setLastEn(en);
                if (es) setLastEs(es);

                if (en || es) {
                    setLines((prev) => {
                        const next = [...prev, { ts: Date.now(), uid: String(uid), en: en || '', es: es || '' }];
                        return next.length > 200 ? next.slice(next.length - 200) : next;
                    });
                }

                // show also in console
                if (en) console.log('[STT] EN:', en);
                if (es) console.log('[STT] ES:', es);
            } catch (err) {
                console.warn('[STT] parse failed:', err);
            }
        });
    };

    const joinAndPublish = async () => {
        console.log('[RTC] About to join with:', {
            appId: APP_ID,
            channel,
            uid: authUser.id,
            rtcTokenType: typeof rtcToken,
            rtcTokenLen: rtcToken?.length,
        });

        bindRtcEvents();

        // Join RTC
        await client.join(APP_ID, channel, rtcToken || null, authUser.id);
        console.log('[RTC] joined OK');

        // Subscribe to already-present users
        for (const r of client.remoteUsers) {
            try {
                if (r.hasVideo) {
                    await client.subscribe(r, 'video');
                    r.videoTrack?.play(remoteVideoRef.current);
                }
                if (r.hasAudio) {
                    await client.subscribe(r, 'audio');
                    r.audioTrack?.play();
                }
            } catch (e) {
                console.error('[RTC] retro subscribe failed', e);
            }
        }

        // Create & publish local tracks
        localTracks.current.videoTrack = await AgoraRTC.createCameraVideoTrack();
        localTracks.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        localTracks.current.videoTrack.play(localVideoRef.current);
        await client.publish([localTracks.current.videoTrack, localTracks.current.audioTrack]);

        console.log('[RTC] published local tracks');
        setJoined(true);

        // Start STT agent via BACKEND
        if (!agentStartingRef.current) {
            agentStartingRef.current = true;
            setSttStatus('starting');
            setSttError('');
            try {
                // small delay so RTC publish is live before agent joins
                await new Promise((r) => setTimeout(r, 800));

                const payload = {
                    appId: APP_ID,
                    channelName: channel,
                    pubBotUid: PUB_BOT_UID,
                    languages: TRANSCRIBE_LANGS,
                    translateSource: TRANSLATE_SOURCE,
                    translateTargets: TRANSLATE_TARGETS,
                };

                console.log('[STT] POST /chats/join-text-to-speech payload:', payload);
                const res = await axios.post('/chats/join-text-to-speech', payload);

                const newAgentId =
                    res?.data?.agentId ||
                    res?.data?.agent_id ||
                    res?.data?.agentID ||
                    res?.data?.agent ||
                    null;

                setAgentId(newAgentId);
                setSttStatus('running');
                console.log('[STT] agent started:', newAgentId, '| pubBotUid:', PUB_BOT_UID);
            } catch (e) {
                setSttStatus('error');
                setSttError(String(e?.response?.data?.message || e?.response?.data || e?.message || e));
                console.error('[STT] join-text-to-speech failed:', e?.response?.data || e?.message || e);
            } finally {
                agentStartingRef.current = false;
            }
        }
    };

    const stopAgentViaBackend = async () => {
        if (!agentId) return;
        try {
            await axios.post('/chats/leave-text-to-speech', { appId: APP_ID, agentId });
            console.log('[STT] agent stopped:', agentId);
            setSttStatus('stopped');
        } catch (e) {
            console.warn('[STT] leave-text-to-speech failed:', e?.response?.data || e?.message || e);
        } finally {
            setAgentId(null);
        }
    };

    const leaveRtc = async () => {
        try {
            for (const track of Object.values(localTracks.current)) {
                track?.stop();
                track?.close();
            }
            localTracks.current = { videoTrack: null, audioTrack: null };

            client.off('user-published');
            client.off('user-unpublished');
            client.off('user-joined');
            client.off('user-left');
            client.off('stream-message');

            await client.leave();
        } catch (e) {
            console.warn('[RTC] leaveRtc error', e);
        } finally {
            setJoined(false);
        }
    };

    const fullLeave = async () => {
        await stopAgentViaBackend();
        await leaveRtc();
        dispatch(clearChatToken());
    };

    // =================== Subtitle parsing helpers ===================
    // Decompress gzip (only when backend set rtcConfig.enableJsonProtocol=true)
    const gunzipToText = async (u8) => {
        if ('DecompressionStream' in window) {
            const ds = new DecompressionStream('gzip');
            const blob = new Blob([u8]);
            const stream = blob.stream().pipeThrough(ds);
            return await new Response(stream).text();
        }
        return new TextDecoder().decode(u8);
    };

    // Best-effort parsing (Agora subtitle JSON schema can vary)
    const pickEnglish = (o) => {
        try {
            if (o?.trans?.length) {
                const t = o.trans.find((t) => (t.lang || '').toLowerCase().startsWith('en'));
                if (t?.texts?.length) return (t.texts.find(Boolean) || '').trim();
                if (t?.text) return String(t.text).trim();
            }
            if (o?.words?.length) {
                const finals = o.words.filter((w) => w?.is_final).map((w) => w.text).filter(Boolean);
                if (finals.length) return finals.join(' ').trim();
            }
            if (o?.text) return String(o.text).trim();
        } catch {}
        return '';
    };

    const pickTranslation = (o, lang) => {
        try {
            if (!o?.trans?.length) return '';
            const found = o.trans.find((t) => String(t.lang).toLowerCase() === String(lang).toLowerCase());
            if (found?.texts?.length) return (found.texts.find(Boolean) || '').trim();
            if (found?.text) return String(found.text).trim();
        } catch {}
        return '';
    };

    // ================= UI toggles =================
    const toggleMic = async () => {
        const t = localTracks.current?.audioTrack;
        if (!t) return;
        await t.setEnabled(!micOn);
        setMicOn((v) => !v);
    };

    const toggleCam = async () => {
        const t = localTracks.current?.videoTrack;
        if (!t) return;
        await t.setEnabled(!camOn);
        setCamOn((v) => !v);
    };

    const toggleScreen = async () => {
        if (!screenOn) {
            const [screenTrack] = await AgoraRTC.createScreenVideoTrack({});
            if (localTracks.current.videoTrack) {
                await client.unpublish([localTracks.current.videoTrack]);
                localTracks.current.videoTrack.stop();
                localTracks.current.videoTrack.close();
            }
            localTracks.current.videoTrack = screenTrack;
            localTracks.current.videoTrack.play(localVideoRef.current);
            await client.publish([localTracks.current.videoTrack]);
            setScreenOn(true);
        } else {
            await client.unpublish([localTracks.current.videoTrack]);
            localTracks.current.videoTrack.stop();
            localTracks.current.videoTrack.close();

            const camTrack = await AgoraRTC.createCameraVideoTrack();
            localTracks.current.videoTrack = camTrack;
            localTracks.current.videoTrack.play(localVideoRef.current);
            await client.publish([localTracks.current.videoTrack]);

            setScreenOn(false);
            if (!camOn) await camTrack.setEnabled(false);
        }
    };

    if (!authUser?.id || authUser.id.length < 1) {
        return <div className="video-call-wrapper video-call-wrapper-debug" />;
    }

    return (
        <div className="video-call-wrapper">
            <h2 className="video-call-title">Agora Video Call + STT (EN→ES)</h2>

            <div className="vc-sharebar">
                <div className="vc-channel">
                    Channel:&nbsp;<code>{channel || '(click Start to generate)'}</code>
                </div>
                <button
                    className="vc-btn"
                    onClick={() => {
                        const ch = channel || generateChannel();
                        navigator.clipboard?.writeText(ch).catch(() => {});
                    }}
                >
                    Copy Channel
                </button>
            </div>

            <div className="vc-main">
                <div className="vc-stage">
                    <div ref={remoteVideoRef} className="vc-remote" />
                    <div ref={localVideoRef} className="vc-pip">
                        <span className="vc-pip-label">You</span>
                    </div>

                    <div className="vc-controls">
                        <button
                            className={`vc-iconbtn ${!micOn ? 'is-muted' : ''}`}
                            onClick={toggleMic}
                            title={micOn ? 'Mute mic' : 'Unmute mic'}
                        >
                            {micOn ? '🎙️' : '🔇'}
                        </button>

                        <button
                            className={`vc-iconbtn ${!camOn ? 'is-muted' : ''}`}
                            onClick={toggleCam}
                            title={camOn ? 'Camera off' : 'Camera on'}
                        >
                            {camOn ? '📷' : '🚫'}
                        </button>

                        <button
                            className="vc-iconbtn"
                            onClick={toggleScreen}
                            title={screenOn ? 'Stop sharing' : 'Share screen'}
                        >
                            {screenOn ? '🛑' : '🖥️'}
                        </button>

                        {!joined ? (
                            <button className="vc-iconbtn" onClick={startCall} title="Start / Join">
                                ▶️
                            </button>
                        ) : (
                            <button className="vc-iconbtn is-danger" onClick={fullLeave} title="Leave">
                                ⏹️
                            </button>
                        )}
                    </div>
                </div>

                <aside className="vc-sidebar">
                    <div className="vc-files-head">Medical Reports</div>
                    <ul className="vc-files">
                        <li className="vc-file">
                            <span className="vc-file-icon">📄</span>
                            <span className="vc-file-name">Medical Report.pdf</span>
                            <button className="vc-file-x" title="Remove">
                                ×
                            </button>
                        </li>
                    </ul>
                </aside>
            </div>

            {/* ✅ Transcript / Translation output */}
            <div className="vc-bottom">
                <div className="vc-translation" style={{ width: '100%' }}>
                    <div className="vc-transcript" style={{ marginBottom: 8 }}>
                        <em>Status:</em>&nbsp;
                        {joined ? 'Joined' : 'Not joined'}
                        <span>&nbsp;|&nbsp;STT: <code>{sttStatus}</code></span>
                        {agentId ? (
                            <span>&nbsp;|&nbsp;Agent: <code>{agentId}</code></span>
                        ) : (
                            <span>&nbsp;|&nbsp;Agent: <code>none</code></span>
                        )}
                        <span>&nbsp;|&nbsp;Bot UID: <code>{PUB_BOT_UID}</code></span>
                        {sttError ? <span>&nbsp;|&nbsp;<span style={{ color: '#b00020' }}>{sttError}</span></span> : null}
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div><strong>EN (latest)</strong></div>
                            <div style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8, minHeight: 44 }}>
                                {lastEn || <span style={{ opacity: 0.6 }}>(waiting… speak in the call)</span>}
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div><strong>ES (latest)</strong></div>
                            <div style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8, minHeight: 44 }}>
                                {lastEs || <span style={{ opacity: 0.6 }}>(waiting…)</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong>Transcript log</strong>
                            <button className="vc-btn" onClick={() => setLines([])} style={{ padding: '4px 10px' }}>
                                Clear
                            </button>
                        </div>

                        <div style={{ marginTop: 6, maxHeight: 200, overflow: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
                            {lines.length === 0 ? (
                                <div style={{ opacity: 0.6 }}>(no subtitle packets received yet)</div>
                            ) : (
                                lines.slice().reverse().map((l) => (
                                    <div key={`${l.ts}-${l.uid}`} style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                                            {new Date(l.ts).toLocaleTimeString()} — uid {l.uid}
                                        </div>
                                        {l.en ? <div><strong>EN:</strong> {l.en}</div> : null}
                                        {l.es ? <div><strong>ES:</strong> {l.es}</div> : null}
                                        {l.rawText ? <div style={{ opacity: 0.7, fontSize: 12 }}><strong>raw:</strong> {l.rawText}</div> : null}
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ marginTop: 8, opacity: 0.75, fontSize: 12 }}>
                            If you see <code>[STT raw]</code> logs but no EN/ES lines:
                            <ul style={{ margin: '6px 0 0 18px' }}>
                                <li><code>PUB_BOT_UID</code> doesn’t match backend’s <code>pubBotUid</code>.</li>
                                <li>Backend STT join is not using <code>rtcConfig.enableJsonProtocol=true</code> → payload is not JSON.</li>
                                <li>STT agent started, but isn’t actually receiving speaker audio (backend may need to subscribe to the right UIDs).</li>
                            </ul>
                            Also: you will NOT see browser console logs in your terminal — open DevTools Console.
                        </div>
                    </div>
                </div>

                <button className="vc-btn" onClick={() => console.log('Open Chat')}>
                    Open Chat
                </button>
            </div>
        </div>
    );
}