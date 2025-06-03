// src/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall.css';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const TOKEN = null;
const CHANNEL = 'testchannel';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

function VideoCall() {
    const [joined, setJoined] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localTracks = useRef({ videoTrack: null, audioTrack: null });

    useEffect(() => {
        return () => {
            leaveChannel(); // Cleanup on unmount
        };
    }, []);

    const joinChannel = async () => {
        const uid = await client.join(APP_ID, CHANNEL, TOKEN || null, null);
        localTracks.current.videoTrack = await AgoraRTC.createCameraVideoTrack();
        localTracks.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        localTracks.current.videoTrack.play(localVideoRef.current);

        await client.publish(Object.values(localTracks.current));

        client.on('user-published', async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === 'video') {
                const remoteVideoTrack = user.videoTrack;
                remoteVideoTrack.play(remoteVideoRef.current);
            }
            if (mediaType === 'audio') {
                const remoteAudioTrack = user.audioTrack;
                remoteAudioTrack.play();
            }
        });

        setJoined(true);
    };

    const leaveChannel = async () => {
        for (let track of Object.values(localTracks.current)) {
            track?.stop();
            track?.close();
        }
        await client.leave();
        setJoined(false);
    };

    return (
        <div className="video-call-wrapper">
            <h2 className="video-call-title">Agora Video Call</h2>
            <div className="video-container">
                <div ref={localVideoRef} className="video-box" />
                <div ref={remoteVideoRef} className="video-box" />
            </div>
            <div className="video-controls">
                {!joined ? (
                    <button onClick={joinChannel}>Join Call</button>
                ) : (
                    <button onClick={leaveChannel}>Leave Call</button>
                )}
            </div>
        </div>
    );
}

export default VideoCall;