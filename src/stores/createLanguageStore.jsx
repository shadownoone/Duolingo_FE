import languages from '../utils/languages';

const spanishLanguageIndex = 6;

export const createLanguageSlice = (set) => ({
  language: languages[spanishLanguageIndex],
  setLanguage: (newLanguage) => {
    // Kiểm tra xem ngôn ngữ có tồn tại trong danh sách không
    const isValidLanguage = languages.some(
      (language) => language.code === newLanguage.code
    );

    if (isValidLanguage) {
      set({ language: newLanguage });
    } else {
      console.warn(
        `Invalid language selected: ${newLanguage?.name || 'Unknown'}`
      );
    }
  },
});
