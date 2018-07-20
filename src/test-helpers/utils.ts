const nextTick = setTimeout;

export function nextTickPromise(): Promise<void> {
  return new Promise(resolve => nextTick(resolve));
}
