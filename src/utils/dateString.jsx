import dayjs from "dayjs";

const DATE_STRING_FORMAT = "YYYY-MM-DD";

export const toDateString = (dateInput) => {
  if (!dateInput) {
    console.warn("Invalid date provided to `toDateString`:", dateInput);
    return "";
  }

  const day = dayjs(dateInput);
  if (!day.isValid()) {
    console.warn("Invalid date provided to `toDateString`:", dateInput);
    return "";
  }

  return day.format(DATE_STRING_FORMAT);
};
