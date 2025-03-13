import dayjs from 'dayjs';
import { toDateString } from '../utils/dateString';
import { range, sum } from '../utils/array-utils';

const addXpToday = (xpByDate, xp) => {
  return addXp(xpByDate, xp, dayjs());
};

const addXp = (xpByDate, xp, date) => {
  return {
    ...xpByDate,
    [toDateString(date)]: xpAt(xpByDate, date) + xp,
  };
};

const xpAt = (xpByDate, date) => {
  return xpByDate[toDateString(date)] ?? 0;
};

export const createXpSlice = (set, get) => ({
  xpByDate: {},

  increaseXp: (by) => {
    if (typeof by !== 'number' || by < 0) {
      console.warn('Invalid XP value. XP must be a positive number.');
      return;
    }
    set({ xpByDate: addXpToday(get().xpByDate, by) });
  },

  xpToday: () => xpAt(get().xpByDate, dayjs()),

  xpThisWeek: () => {
    return sum(
      range(0, dayjs().day() + 1).map((daysBack) =>
        xpAt(get().xpByDate, dayjs().subtract(daysBack, 'day'))
      )
    );
  },
});
