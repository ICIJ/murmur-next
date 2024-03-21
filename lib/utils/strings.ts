export function isUrl(value: string): boolean {
  try {
    new URL(value);
  } catch (_) {
    return false;
  }
  return true;
}
