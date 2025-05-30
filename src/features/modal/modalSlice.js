import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthModalOpen: false,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openAuthModal: (state) => {
            state.isAuthModalOpen = true;
        },
        closeAuthModal: (state) => {
            state.isAuthModalOpen = false;
        },
        toggleAuthModal: (state) => {
            state.isAuthModalOpen = !state.isAuthModalOpen;
        },
    },
});

export const { openAuthModal, closeAuthModal, toggleAuthModal } = modalSlice.actions;

export default modalSlice.reducer;