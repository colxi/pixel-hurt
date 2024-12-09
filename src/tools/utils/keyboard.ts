export const hasKeyModifiers = (e: KeyboardEvent) => {
  return e.metaKey || e.shiftKey || e.ctrlKey
}
