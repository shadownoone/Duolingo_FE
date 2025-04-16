// features/language/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // mảng danh sách ngôn ngữ hoặc thông tin ngôn ngữ mà bạn muốn lưu
  languages: [],
  // ngôn ngữ hiện tại người dùng đã chọn
  currentLanguage: { language_id: null },
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    // 1) Lưu danh sách các ngôn ngữ (ví dụ sau khi fetch API getAllLanguages)
    setLanguages: (state, action) => {
      state.languages = action.payload; // action.payload là mảng languages
    },
    // 2) Chọn 1 ngôn ngữ
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload; // action.payload {language_id, language_name,...}
    },
    // 3) Reset language slice
    resetLanguage: (state) => {
      state.languages = [];
      state.currentLanguage = null;
    },
  },
});

export const { setLanguages, setCurrentLanguage, resetLanguage } =
  languageSlice.actions;

export default languageSlice.reducer;
