// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Load token from localStorage if available
const tokenFromStorage = localStorage.getItem('accessToken');

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/authentication/login', { email, password });
            const token = response.data.accessToken;
            
            // Save to localStorage
            localStorage.setItem('accessToken', token);

            // Add token to axios default headers
            console.log('We have token: ', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return token;
        } catch (error) {
            return rejectWithValue(error.response?.data?.Message || 'Login failed');
        }
    }
);

export const fetchUserMe = createAsyncThunk(
    'auth/fetchUserMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/users/me');
            console.log('ME: ', response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: tokenFromStorage || null,
        status: 'idle',
        error: null,
        user: null,
        userDetailId: ''
    },
    reducers: {
        logout: (state) => {
            state.accessToken = null;
            state.status = 'idle';
            state.error = null;
            state.user = null;
            state.userDetailId = '';
            localStorage.removeItem('accessToken');
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUserMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.userDetailId = action.payload.userDetailId;
                state.error = null;
            })
            .addCase(fetchUserMe.rejected, (state, action) => {
                state.user = null;
                state.userDetailId = '';
                state.error = action.payload;
                state.accessToken = null;
                localStorage.removeItem('accessToken');
                delete axios.defaults.headers.common['Authorization'];
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;