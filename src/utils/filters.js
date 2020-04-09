export const tofixed = number => {
  number = +number || 0;
  return number.toFixed(2);
};
