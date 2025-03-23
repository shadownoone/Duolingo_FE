import { createSlice } from "@reduxjs/toolkit";

// Trạng thái ban đầu
const initialState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

// Export action creators
export const { addCurrentUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
