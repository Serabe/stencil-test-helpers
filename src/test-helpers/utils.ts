const nextTick = setTimeout;

export function nextTickPromise(): Promise<void> {
  return new Promise(resolve => nextTick(resolve));
}

export function isNumeric(n: string): boolean {
  let num = parseFloat(n);
  return !isNaN(num) && isFinite(num);
}
