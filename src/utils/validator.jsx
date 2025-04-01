export function isRequired(value) {
  return value.trim() !== "";
}

// Kiểm tra không chứa dấu cách
export function noSpace(value) {
  return !value.includes(" ");
}

//
export function isMax10(value) {
  return value.length <= 10;
}

export function isGmail(value) {
  const emailLower = String(value).toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(emailLower) && emailLower.endsWith("@gmail.com");
}
