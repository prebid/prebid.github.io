// Deliberate bounded-review smoke fixture. DO NOT MERGE.
export function insideWindow(now, start, end) {
  return now >= start || now <= end;
}
