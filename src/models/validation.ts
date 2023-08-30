const reg_int_non_zero = /[1-9][0-9]+/;
const reg_int = /0[1-9]+/;

export const checkuint = (target: string, isstrict = true): number => {
  if (!reg_int.test(target)) return -1;
  if (isstrict && !reg_int_non_zero.test(target)) return -2;
  return parseInt(target);
};
