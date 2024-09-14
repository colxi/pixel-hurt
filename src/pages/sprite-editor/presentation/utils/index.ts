import { MouseEvent } from 'react'
import { Coordinates } from '../../types'

export type CanvasMouseEvent = MouseEvent<
  HTMLCanvasElement,
  globalThis.MouseEvent
>

// colxi, review this default canvasZoom value
export const getCanvasClickMouseCoords = (
  e: CanvasMouseEvent,
  canvasZoom: number
): Coordinates => {
  if (!e.target) throw new Error('Target not found')
  const targetElement = e.target as HTMLElement
  const rect = targetElement.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / canvasZoom)
  const y = Math.floor((e.clientY - rect.top) / canvasZoom)
  return { x, y }
}
