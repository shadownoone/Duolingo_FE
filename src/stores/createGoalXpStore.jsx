export const createGoalXpSlice = (set) => ({
  goalXp: 10, // Mặc định là 10
  setGoalXp: (newGoalXp) => {
    // Kiểm tra giá trị hợp lệ trước khi đặt lại goalXp
    const validGoalXpValues = [1, 10, 20, 30, 50];
    if (validGoalXpValues.includes(newGoalXp)) {
      set({ goalXp: newGoalXp });
    } else {
      console.warn(`Invalid goalXp value: ${newGoalXp}`);
    }
  },
});
