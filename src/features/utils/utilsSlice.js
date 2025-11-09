import { createSlice } from '@reduxjs/toolkit';


const utilsSlice = createSlice({
    name: 'utils',
    initialState: {
        mainClick: 1
    },
    reducers: {
        updateMainClick: (state) => {
            state.mainClick = new Date().getTime();
        }
    }
})



export const { updateMainClick } = utilsSlice.actions;
export default utilsSlice.reducer;