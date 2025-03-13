export const createSoundSettingsSlice = (set) => ({
  soundEffects: true,
  speakingExercises: true,
  listeningExercises: true,

  setSoundEffects: (isOn) => {
    if (typeof isOn !== 'boolean') {
      console.warn(`Invalid value for soundEffects: ${isOn}`);
      return;
    }
    set(() => ({ soundEffects: isOn }));
  },

  setSpeakingExercises: (isOn) => {
    if (typeof isOn !== 'boolean') {
      console.warn(`Invalid value for speakingExercises: ${isOn}`);
      return;
    }
    set(() => ({ speakingExercises: isOn }));
  },

  setListeningExercises: (isOn) => {
    if (typeof isOn !== 'boolean') {
      console.warn(`Invalid value for listeningExercises: ${isOn}`);
      return;
    }
    set(() => ({ listeningExercises: isOn }));
  },
});
