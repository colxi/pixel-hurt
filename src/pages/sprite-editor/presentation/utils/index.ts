import { MouseEvent } from 'react'
import { Coordinates } from '../../types'

export type CanvasMouseEvent = MouseEvent<
  HTMLCanvasElement,
  globalThis.MouseEvent
>

export const getCanvasClickMouseCoords = (
  e: CanvasMouseEvent,
  canvasZoom: number = 1
): Coordinates => {
  if (!e.target) throw new Error('Target not found')
  const targetElement = e.target as HTMLElement
  const rect = targetElement.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / canvasZoom)
  const y = Math.floor((e.clientY - rect.top) / canvasZoom)
  return { x, y }
}
