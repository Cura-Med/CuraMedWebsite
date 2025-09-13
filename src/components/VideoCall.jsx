// src/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall.css';
import {useDispatch, useSelector} from "react-redux";
import {openAuthModal} from "../features/modal/modalSlice.js";
import {useNavigate} from "react-router-dom";
import { getChatToken } from '../features/chat/chatSlice';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
let TOKEN = null;
let CHANNEL = 'testchannel';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

function VideoCall() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [joined, setJoined] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localTracks = useRef({ videoTrack: null, audioTrack: null });
    const user = useSelector(state => state.auth.user);
    const chatToken = useSelector(state => state.chat.token);

    const [token, setToken] = useState('zxc');
    const [channel, setChannel] = useState('test');

    useEffect(() => {
        if (!user?.id || user.id.length < 1) {
            dispatch(openAuthModal());
            navigate('/');
        }
    }, [user]);

    useEffect(() => {
        return () => {
            leaveChannel(); // Cleanup on unmount
        };
    }, []);

    const giveMeAQuickHash = () => {
        let str = Math.random().toString(36).substring(2, 20) || 'test';
        setChannel(str)
        return str;
    }

/*    const joinChannel = async () => {
        const uid = await client.join(APP_ID, CHANNEL, TOKEN || null, null);
        dispatch(getChatToken(giveMeAQuickHash()));
    };*/

    const joinChannel = async () => {
        const generatedChannel = giveMeAQuickHash();
        setChannel(generatedChannel);

        // Fetch your Agora token
        await dispatch(getChatToken(generatedChannel));
    };



    useEffect(() => {
        if (chatToken && chatToken.length > 10) {
            setJoinChannel().then(r => {})
        }
    }, [chatToken]);

    const setJoinChannel = async () => {
        console.log('setJoinChannel init: ', chatToken)
        const uid = await client.join('391ff5b81d70497cba1ab6f7ac65fdd9', channel, chatToken || null, user.id);

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

    if (!user?.id || user.id.length < 1) {
        return (
            <div className="video-call-wrapper video-call-wrapper-debug"></div>
        )
    } else {
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


}

export default VideoCall;