import dayjs from 'dayjs';
import { toDateString } from '../utils/dateString';

const addActiveDay = (activeDays, day) => {
  return new Set([...activeDays, toDateString(day)]);
};

const isActiveDay = (activeDays, day) => {
  return activeDays.has(toDateString(day));
};

const getCurrentStreak = (activeDays) => {
  let daysBack = 0;
  let day = dayjs();
  while (isActiveDay(activeDays, day)) {
    day = day.add(-1, 'day');
    daysBack += 1;
  }
  return daysBack;
};

export const createStreakSlice = (set, get) => ({
  activeDays: new Set(),
  streak: 0,

  isActiveDay: (day) => isActiveDay(get().activeDays, day),

  addToday: () => {
    const activeDays = addActiveDay(get().activeDays, dayjs());
    set({ activeDays, streak: getCurrentStreak(activeDays) });
  },
});
