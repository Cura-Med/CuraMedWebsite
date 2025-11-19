import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall3.css';
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../features/modal/modalSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { getChatToken } from '../features/chat/chatSlice';

// ======== ⚠️ FRONTEND-ONLY PROTOTYPE (DO NOT SHIP LIKE THIS) =========
const APP_ID                = import.meta.env.VITE_AGORA_APP_ID;          // 32-hex App ID
// Bot UIDs must be unique in the channel and not collide with humans
const PUB_BOT_UID = '99002';

const TRANSCRIBE_LANGS  = ['en-US'];        // source recognition
const TRANSLATE_SOURCE  = 'en-US';
const TRANSLATE_TARGETS = ['es-ES'];        // <— Spanish per request
// =====================================================================

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoCall3() {
    const { callId } = useParams();
    const dispatch = useDispatch();
    const navigate  = useNavigate();

    const authUser  = useSelector(s => s.auth.user);
    const rtcToken  = useSelector(s => s.chat.token);

    const [channel, setChannel] = useState('');
    const [joined,  setJoined]  = useState(false);

    const [agentId, setAgentId] = useState(null);

    const localVideoRef  = useRef(null);
    const remoteVideoRef = useRef(null);
    const localTracks    = useRef({ videoTrack: null, audioTrack: null });

    // Require auth
    useEffect(() => {
        if (!authUser?.id || authUser.id.length < 1) {
            dispatch(openAuthModal());
            navigate('/');
        }
    }, [authUser, dispatch, navigate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => { leaveChannel(); tryStopAgent().catch(() => {}); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateChannel = () => {
        const ch = callId;
        setChannel(ch);
        console.log('Channel:', ch);
        return ch;
    };

    const startCall = async () => {
        const ch = channel || generateChannel();
        await dispatch(getChatToken(ch));
    };

    // Join when token arrives
    useEffect(() => {
        if (!joined && channel && typeof rtcToken === 'string') {
            joinAndPublish().catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rtcToken]);

    const joinAndPublish = async () => {
        // subscribe to remote users
        client.off('user-published');
        client.on('user-published', async (remoteUser, mediaType) => {
            try {
                await client.subscribe(remoteUser, mediaType);
                if (mediaType === 'video') remoteUser.videoTrack?.play(remoteVideoRef.current);
                if (mediaType === 'audio') remoteUser.audioTrack?.play();
            } catch (e) { console.error('subscribe failed', e); }
        });

        client.off('user-unpublished');
        client.on('user-unpublished', () => {});

        // listen for STT subtitle packets from PUB_BOT_UID
        client.off('stream-message');
        client.on('stream-message', async (uid, payload /* Uint8Array */) => {
            if (String(uid) !== String(PUB_BOT_UID)) return;
            try {
                const text = await gunzipToText(payload);
                const obj  = JSON.parse(text);
                // Robust best-effort parsing (schema can vary slightly)
                const en = pickEnglish(obj);
                const es = pickTranslation(obj, 'es-ES');
                if (en) console.log('EN:', en);
                if (es) console.log('ES:', es);
            } catch (err) {
                console.warn('STT parse failed, raw length:', payload?.length, err);
            }
        });

        await client.join(APP_ID, channel, rtcToken || null, authUser.id);

        // retro-subscribe existing
        for (const r of client.remoteUsers) {
            try {
                if (r.hasVideo) { await client.subscribe(r, 'video'); r.videoTrack?.play(remoteVideoRef.current); }
                if (r.hasAudio) { await client.subscribe(r, 'audio'); r.audioTrack?.play(); }
            } catch (e) { console.error('retro subscribe failed', e); }
        }

        // publish local
        localTracks.current.videoTrack = await AgoraRTC.createCameraVideoTrack();
        localTracks.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTracks.current.videoTrack.play(localVideoRef.current);
        await client.publish([localTracks.current.videoTrack, localTracks.current.audioTrack]);

        setJoined(true);

        // === v7: JOIN (start) STT agent ===
        try {
            const id = await v7Join({
                appId: APP_ID,
                channelName: channel,
                pubBotUid: PUB_BOT_UID,
                languages: TRANSCRIBE_LANGS,
                translateSource: TRANSLATE_SOURCE,
                translateTargets: TRANSLATE_TARGETS,
            });
            setAgentId(id);
            console.log('[STT v7] agent started:', id);
        } catch (e) {
            console.error('[STT v7] join failed:', e);
        }
    };

    const leaveChannel = async () => {
        try {
            for (const track of Object.values(localTracks.current)) {
                track?.stop();
                track?.close();
            }
            localTracks.current = { videoTrack: null, audioTrack: null };
            client.off('user-published');
            client.off('user-unpublished');
            client.off('stream-message');
            await client.leave();
        } catch (e) {
            console.warn('leaveChannel error', e);
        }
        setJoined(false);
    };

    // ============== v7 STT REST (Join/Stop) – PROTOTYPE ONLY =================
    const basicAuthHeader = () => {
        return `Basic NjVhMDNhM2Y4ZGY1NGQ5OWE4OTU2ZjBmYmNkNmRhNTY6ZGE2ZWU2NzYxZmNiNDYzMzk2NjAxMTNlNWVlYTQ2NjE=`;
    };

    async function v7Join({ appId, channelName, pubBotUid, languages, translateSource, translateTargets }) {
        const url = `https://api.agora.io/api/speech-to-text/v1/projects/${encodeURIComponent(appId)}/join`;
        const body = {
            name: `stt-agent-${Date.now()}`,
            languages,
            rtcConfig: {
                channelName,
                pubBotUid: String(pubBotUid),
                enableJsonProtocol: true // gzip JSON subtitle packets
            },
            translateConfig: {
                languages: [
                    { source: translateSource, target: translateTargets }
                ]
            }
        };
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': basicAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
        if (!json?.agent_id) throw new Error('No agent_id in response');
        return json.agent_id;
    }

    async function tryStopAgent() {
        if (!agentId) return;
        const url = `https://api.agora.io/api/speech-to-text/v1/projects/${encodeURIComponent(APP_ID)}/agents/${encodeURIComponent(agentId)}`;
        try {
            await fetch(url, { method: 'DELETE', headers: { 'Authorization': basicAuthHeader() } });
            console.log('[STT v7] agent stopped:', agentId);
        } catch (e) {
            console.warn('stop agent failed', e);
        }
    }

    // =================== Subtitle parsing helpers ===================
    // Decompress gzip (JSON protocol)
    const gunzipToText = async (u8) => {
        if ('DecompressionStream' in window) {
            const ds = new DecompressionStream('gzip');
            const blob = new Blob([u8]);
            const stream = blob.stream().pipeThrough(ds);
            return await new Response(stream).text();
        }
        // fallback: try plain text
        return new TextDecoder().decode(u8);
    };

    // Pick final English line from a JSON subtitle packet
    const pickEnglish = (o) => {
        try {
            // shape 1: { words:[{text,is_final}], trans:[{lang,texts,is_final}] }
            if (o?.trans?.length) {
                const t = o.trans.find(t => (t.lang || '').toLowerCase().startsWith('en'));
                if (t?.texts?.length) return (t.texts.find(Boolean) || '').trim();
            }
            if (o?.words?.length) {
                const finals = o.words.filter(w => w?.is_final).map(w => w.text).filter(Boolean);
                if (finals.length) return finals.join(' ').trim();
            }
            // shape 2: { text:"..." }
            if (o?.text) return String(o.text).trim();
        } catch {}
        return '';
    };

    // Pick translation for a given BCP-47 code (here 'es-ES')
    const pickTranslation = (o, lang) => {
        try {
            if (!o?.trans?.length) return '';
            const found = o.trans.find(t => String(t.lang).toLowerCase() === String(lang).toLowerCase());
            if (found?.texts?.length) return (found.texts.find(Boolean) || '').trim();
            // Sometimes translation is in an array of altText
            if (found?.text) return String(found.text).trim();
        } catch {}
        return '';
    };

    // ================= UI =================
    const [micOn, setMicOn]   = useState(true);
    const [camOn, setCamOn]   = useState(true);
    const [screenOn, setScreenOn] = useState(false);

    const toggleMic = async () => {
        const t = localTracks.current?.audioTrack;
        if (!t) return;
        await t.setEnabled(!micOn);
        setMicOn(!micOn);
    };

    const toggleCam = async () => {
        const t = localTracks.current?.videoTrack;
        if (!t) return;
        await t.setEnabled(!camOn);
        setCamOn(!camOn);
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
            if (!camOn) { await camTrack.setEnabled(false); }
        }
    };

    if (!authUser?.id || authUser.id.length < 1) {
        return <div className="video-call-wrapper video-call-wrapper-debug" />;
    }

    return (
        <div className="video-call-wrapper">
            <h2 className="video-call-title">Agora Video Call + STT v7 (EN→ES) – Frontend Prototype</h2>

            <div className="vc-sharebar">
                <div className="vc-channel">
                    Channel:&nbsp;<code>{channel || '(click Start to generate)'}</code>
                </div>
                <button className="vc-btn" onClick={() => {
                    const ch = channel || generateChannel();
                    navigator.clipboard?.writeText(ch).catch(() => {});
                }}>
                    Copy Channel
                </button>
            </div>

            <div className="vc-main">
                <div className="vc-stage">
                    <div ref={remoteVideoRef} className="vc-remote" />
                    <div ref={localVideoRef} className="vc-pip"><span className="vc-pip-label">You</span></div>

                    <div className="vc-controls">
                        <button className={`vc-iconbtn ${!micOn ? 'is-muted' : ''}`} onClick={toggleMic} title={micOn ? 'Mute mic' : 'Unmute mic'}>{micOn ? '🎙️' : '🔇'}</button>
                        <button className={`vc-iconbtn ${!camOn ? 'is-muted' : ''}`} onClick={toggleCam} title={camOn ? 'Camera off' : 'Camera on'}>{camOn ? '📷' : '🚫'}</button>
                        <button className="vc-iconbtn" onClick={toggleScreen} title={screenOn ? 'Stop sharing' : 'Share screen'}>{screenOn ? '🛑' : '🖥️'}</button>

                        {!joined ? (
                            <button className="vc-iconbtn" onClick={startCall} title="Start / Join">▶️</button>
                        ) : (
                            <>
                                <button className="vc-iconbtn is-danger" onClick={leaveChannel} title="Leave">⏹️</button>
                            </>
                        )}
                    </div>
                </div>

                <aside className="vc-sidebar">
                    <div className="vc-files-head">Medical Reports</div>
                    <ul className="vc-files">
                        <li className="vc-file">
                            <span className="vc-file-icon">📄</span>
                            <span className="vc-file-name">Medical Report.pdf</span>
                            <button className="vc-file-x" title="Remove">×</button>
                        </li>
                    </ul>
                </aside>
            </div>

            <div className="vc-bottom">
                <div className="vc-translation">
                    <div className="vc-transcript"><em>Live (console):</em> watch for <strong>EN</strong> and <strong>ES</strong> lines.</div>
                </div>
                <button className="vc-btn" onClick={() => console.log('Open Chat')}>Open Chat</button>
            </div>
        </div>
    );
}