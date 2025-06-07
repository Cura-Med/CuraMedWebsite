import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const getChatToken = createAsyncThunk(
    'chat/getChatToken',
    async (channelName, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/chats/my-token?channelName=${channelName}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to get chat token');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        token: null,
        status: 'idle',
        error: null
    },
    reducers: {
        clearChatToken: (state) => {
            state.token = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatToken.pending, (state) => {
                state.status = 'loading';
                state.token = null;
                state.error = null;
            })
            .addCase(getChatToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
            })
            .addCase(getChatToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearChatToken } = chatSlice.actions;
export default chatSlice.reducer;