import { units } from '../utils/units'; // Đảm bảo đường dẫn đúng

export const createLessonSlice = (set) => ({
  lessonsCompleted: 0,

  increaseLessonsCompleted: (by = 1) =>
    set(({ lessonsCompleted }) => ({
      lessonsCompleted: lessonsCompleted + by,
    })),

  jumpToUnit: (unitNumber) =>
    set(({ lessonsCompleted }) => {
      const lessonsPerTile = 4;

      // Tính tổng số bài học cần hoàn thành để đạt tới unit cần nhảy tới
      const totalLessonsToJumpToUnit = units
        .filter((unit) => unit.unitNumber < unitNumber)
        .map((unit) => unit.tiles.length * lessonsPerTile)
        .reduce((a, b) => a + b, 0);

      return {
        lessonsCompleted: Math.max(lessonsCompleted, totalLessonsToJumpToUnit),
      };
    }),
});
