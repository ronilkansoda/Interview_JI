import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUserDetail: null,
    loading: false,
    error: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userDetailStart: (state) => {
            state.loading = true;
        },
        userDetailSuccess: (state, action) => {
            state.currentUserDetail = action.payload;
            state.loading = false;
            state.error = false;
        },
        userDetailFailure: (state, action) => {
            state.error = action.payload; 
            state.loading = false;
        },
    }
})

export const { userDetailStart, userDetailSuccess, userDetailFailure } = userSlice.actions;

export default userSlice.reducer;
