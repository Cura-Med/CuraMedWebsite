import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall3.css';
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../features/modal/modalSlice.js";
import { useNavigate } from "react-router-dom";
import { getChatToken } from '../features/chat/chatSlice';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoCall3() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authUser  = useSelector(s => s.auth.user);
    const rtcToken  = useSelector(s => s.chat.token); // your existing token in store

    const [channel, setChannel] = useState('');
    const [joined, setJoined]   = useState(false);

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
        return () => { leaveChannel(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Generate channel once (initiator). You'll paste this value into the other user's hardcoded channel.
    const generateChannel = () => {
        const ch = 'dey402da6qk' // Math.random().toString(36).substring(2, 20);
        setChannel(ch);
        console.log('Generated channel:', ch); // <-- copy this for the other user
        return ch;
    };

    const startCall = async () => {
        const ch = channel || generateChannel();
        // If your backend expects just a string, keep as-is; otherwise pass { channel: ch, uid: authUser.id }
        await dispatch(getChatToken(ch));
    };

    // When token is present, actually join & publish
    useEffect(() => {
        if (!joined && channel && typeof rtcToken === 'string' && rtcToken.length >= 0) {
            joinAndPublish().catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rtcToken]);

    const joinAndPublish = async () => {
        // 1) Listen before publish (so late publications are caught)
        client.off('user-published');
        client.on('user-published', async (remoteUser, mediaType) => {
            try {
                await client.subscribe(remoteUser, mediaType);
                if (mediaType === 'video') remoteUser.videoTrack?.play(remoteVideoRef.current);
                if (mediaType === 'audio') remoteUser.audioTrack?.play();
            } catch (e) {
                console.error('subscribe failed', e);
            }
        });

        client.off('user-unpublished');
        client.on('user-unpublished', () => {
            // Optional: clear remote slot if needed
            // if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = '';
        });

        // 2) Join with env APP_ID (no hard-coded ID). Use authUser.id as uid (must be unique vs the other user).
        await client.join(APP_ID, channel, rtcToken || null, authUser.id);

        // 3) Subscribe to any users already in the room (if they joined/published first)
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
                console.error('retroactive subscribe failed', e);
            }
        }

        // 4) Create & publish local tracks
        localTracks.current.videoTrack = await AgoraRTC.createCameraVideoTrack();
        localTracks.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        localTracks.current.videoTrack.play(localVideoRef.current);
        await client.publish([localTracks.current.videoTrack, localTracks.current.audioTrack]);

        setJoined(true);
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
            await client.leave();
        } catch (e) {
            console.warn('leaveChannel error', e);
        }
        setJoined(false);
    };







    // state for toggles
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

    /* Simple screen share: swap camera track with screen track and back */
    const toggleScreen = async () => {
        if (!screenOn) {
            // start screenshare
            const [screenTrack] = await AgoraRTC.createScreenVideoTrack({});
            // unpublish camera, publish screen
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
            // stop screen, switch back to camera
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
            <h2 className="video-call-title">Agora Video Call</h2>

            {/* Channel share row */}
            <div className="vc-sharebar">
                <div className="vc-channel">
                    Channel:&nbsp;
                    <code>{channel || '(click Start to generate)'}</code>
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

            {/* NEW: Stage + Sidebar layout */}
            <div className="vc-main">
                {/* Stage */}
                <div className="vc-stage">
                    <div ref={remoteVideoRef} className="vc-remote" />
                    <div ref={localVideoRef} className="vc-pip">
                        <span className="vc-pip-label">You</span>
                    </div>

                    {/* Floating Controls */}
                    <div className="vc-controls">
                        <button
                            className={`vc-iconbtn ${!micOn ? 'is-muted' : ''}`}
                            onClick={toggleMic}
                            aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                            title={micOn ? 'Mute mic' : 'Unmute mic'}
                        >
                            {micOn ? '🎙️' : '🔇'}
                        </button>

                        <button
                            className={`vc-iconbtn ${!camOn ? 'is-muted' : ''}`}
                            onClick={toggleCam}
                            aria-label={camOn ? 'Turn camera off' : 'Turn camera on'}
                            title={camOn ? 'Camera off' : 'Camera on'}
                        >
                            {camOn ? '📷' : '🚫'}
                        </button>

                        <button
                            className="vc-iconbtn"
                            onClick={toggleScreen}
                            aria-label={screenOn ? 'Stop sharing' : 'Share screen'}
                            title={screenOn ? 'Stop sharing' : 'Share screen'}
                        >
                            {screenOn ? '🛑' : '🖥️'}
                        </button>

                        {!joined ? (
                            <button className="vc-iconbtn" onClick={startCall} title="Start / Join">
                                ▶️
                            </button>
                        ) : (
                            <button className="vc-iconbtn is-danger" onClick={leaveChannel} title="Leave">
                                ⏹️
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar: Medical Reports */}
                <aside className="vc-sidebar">
                    <div className="vc-files-head">Medical Reports</div>
                    <ul className="vc-files">
                        {/* Replace with your real list/map */}
                        <li className="vc-file">
                            <span className="vc-file-icon">📄</span>
                            <span className="vc-file-name">Medical Report.pdf</span>
                            <button className="vc-file-x" title="Remove">×</button>
                        </li>
                    </ul>
                </aside>
            </div>

            {/* Bottom row: Translation + Chat */}
            <div className="vc-bottom">
                <div className="vc-translation">
                    <select className="vc-select" defaultValue="en" aria-label="Translation language">
                        <option value="en">English</option>
                        <option value="et">Estonian</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                    </select>
                    <div className="vc-transcript">
                        <em>Live Translation:</em>&nbsp;The doctor is explaining the treatment plan…
                    </div>
                </div>

                <button className="vc-btn" onClick={() => console.log('Open Chat')}>
                    Open Chat
                </button>
            </div>
        </div>
    );



}