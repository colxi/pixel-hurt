let active = false

export function disableMouseZoom() {
  if (active) return
  else active = true

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) e.preventDefault()
    },
    { passive: false }
  )
}
