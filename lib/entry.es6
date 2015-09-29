export function abs(val) {
  if (val > 0) {
    return val;
  }
  if (val === 0) {
    return 0;
  }
  return -val;
}

export function halve(i) {
  return i >> 1;
}
