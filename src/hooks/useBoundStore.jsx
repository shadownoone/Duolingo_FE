import { create } from 'zustand';
import { createGoalXpSlice } from '../stores/createGoalXpStore';
import { createLanguageSlice } from '../stores/createLanguageStore';
import { createLessonSlice } from '../stores/createLessonStore.jsx';
import { createLingotSlice } from '../stores/createLingotStore';
import { createSoundSettingsSlice } from '../stores/createSoundSettingsStore';
import { createStreakSlice } from '../stores/createStreakStore';
import { createUserSlice } from '../stores/createUserStore';
import { createXpSlice } from '../stores/createXpStore';

export const useBoundStore = create((...args) => ({
  ...createGoalXpSlice(...args),
  ...createLanguageSlice(...args),
  ...createLessonSlice(...args),
  ...createLingotSlice(...args),
  ...createSoundSettingsSlice(...args),
  ...createStreakSlice(...args),
  ...createUserSlice(...args),
  ...createXpSlice(...args),
}));
