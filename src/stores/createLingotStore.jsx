export const createLingotSlice = (set) => ({
  lingots: 0,

  increaseLingots: (by) => {
    if (typeof by !== 'number' || by <= 0) {
      console.warn(`Invalid lingot increase value: ${by}`);
      return;
    }

    set(({ lingots }) => ({
      lingots: lingots + by,
    }));
  },
});
