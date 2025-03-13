const DATE_STRING_FORMAT = 'YYYY-MM-DD';

export const toDateString = (day) => {
  if (!day || !day.isValid()) {
    console.warn('Invalid date provided to `toDateString`.');
    return '';
  }

  return day.format(DATE_STRING_FORMAT);
};
