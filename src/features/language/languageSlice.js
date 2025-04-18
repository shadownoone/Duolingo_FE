// features/language/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languages: [],
  userLanguages: [],
  currentLanguage: { language_id: null },
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },

    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },

    resetLanguage: (state) => {
      state.languages = [];
      state.currentLanguage = null;
    },

    addUserLanguage: (state, action) => {
      state.userLanguages.push(action.payload);
    },

    setUserLanguages: (state, action) => {
      state.userLanguages = action.payload;
    },
  },
});

export const {
  setLanguages,
  setCurrentLanguage,
  resetLanguage,
  addUserLanguage,
  setUserLanguages,
} = languageSlice.actions;

export default languageSlice.reducer;
