const regIntNonZero = /[1-9][0-9]*/g;
const regInt = /[0-9]+/g;

export const checkuint = (target: string, isstrict = true): number => {
  if (!regInt.test(target)) return -1;
  if (isstrict && !regIntNonZero.test(target)) return -2;

  // Ensure there are no non-numeric characters other than the possible leading sign
  if (!/^-?\d+$/.test(target)) return -1;

  return parseInt(target);
};
