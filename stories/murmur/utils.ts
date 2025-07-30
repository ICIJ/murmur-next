export function humanReadableGb(size: number) {
  if (size >= 1e3) {
    return `${size / 1e3}TB`
  }
  else {
    return `${size}GB`
  }
}
