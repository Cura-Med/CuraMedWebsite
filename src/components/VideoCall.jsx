// src/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '';
const TOKEN = null; // INSECURE app
const CHANNEL = 'testchannel'; // Must match the token's channel name

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
        <div>
            <h2>Agora Video Call</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <div ref={localVideoRef} style={{ width: 320, height: 240, background: '#000' }} />
                <div ref={remoteVideoRef} style={{ width: 320, height: 240, background: '#000' }} />
            </div>
            <div style={{ marginTop: 20 }}>
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