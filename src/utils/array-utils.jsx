// Hàm tạo mảng từ `lo` đến `hi - 1`
export const range = (lo, hi) => {
  const result = Array(hi - lo);
  for (let i = lo; i < hi; i++) {
    result[i - lo] = i;
  }
  return result;
};

// Hàm tính tổng các phần tử trong mảng
export const sum = (numbers) => {
  if (!Array.isArray(numbers)) {
    console.warn('Invalid input: `sum` expects an array.');
    return 0;
  }

  return numbers.reduce((total, number) => {
    if (typeof number !== 'number') {
      console.warn(`Invalid value: ${number} is not a number.`);
      return total;
    }
    return total + number;
  }, 0);
};
