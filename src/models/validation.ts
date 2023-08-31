const reg_int_non_zero = /[1-9][0-9]*/g;
const reg_int = /[0-9]+/g;

export const checkuint = (target: string, isstrict = true): number => {
  if (!reg_int.test(target)) return -1;
  if (isstrict && !reg_int_non_zero.test(target)) return -2;

  // Ensure there are no non-numeric characters other than the possible leading sign
  if (!/^-?\d+$/.test(target)) return -1;

  return parseInt(target);
};
