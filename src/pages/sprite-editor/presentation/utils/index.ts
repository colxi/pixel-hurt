import { MouseEvent } from 'react'
import { Coordinates } from '../../types'

export type CanvasMouseEvent = MouseEvent<
  HTMLCanvasElement,
  globalThis.MouseEvent
>

export const getCanvasCurrentZoom = (canvas: HTMLCanvasElement): number => {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Context not available')
  let storedTransform = context.getTransform()
  const scale = storedTransform.m11
  return scale
}

// colxi, review this default canvasZoom value
export const getCanvasClickMouseCoords = (
  e: CanvasMouseEvent,
  canvasZoom: number
): Coordinates => {
  if (!e.target) throw new Error('Target not found')
  const targetElement = e.target as HTMLCanvasElement
  const zoom = getCanvasCurrentZoom(targetElement)
  const rect = targetElement.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / canvasZoom)
  const y = Math.floor((e.clientY - rect.top) / canvasZoom)
  return { x, y }
}
