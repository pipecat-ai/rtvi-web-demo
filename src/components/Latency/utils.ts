export function calculateMedian(deltaArray: number[]) {
  // sort array ascending
  const asc = (arr: number[]) => arr.sort((a, b) => a - b);

  const quantile = (arr: number[], q: number) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  //const q25 = (arr) => quantile(arr, 0.25);

  const q50 = (arr: number[]) => quantile(arr, 0.5);

  //const q75 = (arr) => quantile(arr, 0.75);

  const median = (arr: number[]) => q50(arr);

  return median(deltaArray);
}
