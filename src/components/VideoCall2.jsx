// src/VideoCallInitiator.jsx
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall.css';
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../features/modal/modalSlice.js";
import { useNavigate } from "react-router-dom";
import { getChatToken } from '../features/chat/chatSlice';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoCall2() {
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
        const ch = '8ufur0r62yp' // Math.random().toString(36).substring(2, 20);
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

    if (!authUser?.id || authUser.id.length < 1) {
        return <div className="video-call-wrapper video-call-wrapper-debug" />;
    }

    return (
        <div className="video-call-wrapper">
            <h2 className="video-call-title">Agora Video Call</h2>

            <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                    Channel to share with the other user:&nbsp;
                    <code>{channel || '(click Start to generate)'}</code>
                </div>
                <button
                    onClick={() => {
                        const ch = channel || generateChannel();
                        navigator.clipboard?.writeText(ch).catch(()=>{});
                    }}
                    style={{ marginTop: 6 }}
                >
                    Copy Channel
                </button>
            </div>

            <div className="video-container">
                <div ref={localVideoRef} className="video-box" />
                <div ref={remoteVideoRef} className="video-box" />
            </div>

            <div className="video-controls">
                {!joined ? (
                    <button onClick={startCall}>Start / Join</button>
                ) : (
                    <button onClick={leaveChannel}>Leave</button>
                )}
            </div>
        </div>
    );
}