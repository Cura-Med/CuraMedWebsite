import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../features/modal/modalSlice';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import utilsReducer from '../features/utils/utilsSlice';

export const store = configureStore({
    reducer: {
        modal: modalReducer,
        auth: authReducer,
        chat: chatReducer,
        utils: utilsReducer
    },
});