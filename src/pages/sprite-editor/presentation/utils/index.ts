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
  console.log(storedTransform.m11)
  const scale = storedTransform.m11
  return scale * 10
}

// colxi, review this default canvasZoom value
export const getCanvasClickMouseCoords = (
  e: CanvasMouseEvent | MouseEvent,
  canvasZoom: number
): Coordinates => {
  if (!e.target) throw new Error('Target not found')
  const targetElement = e.target as HTMLCanvasElement
  // const zoom = getCanvasCurrentZoom(targetElement)
  const rect = targetElement.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / canvasZoom)
  const y = Math.floor((e.clientY - rect.top) / canvasZoom)
  return { x, y }
}

export const getCanvasImageCoords = (
  coordinates: Coordinates,
  canvas: HTMLCanvasElement,
  canvasZoom: number,
  offset: Coordinates = { x: 0, y: 0 }
): Coordinates => {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor((coordinates.x - rect.left) / canvasZoom)
  const y = Math.floor((coordinates.y - rect.top) / canvasZoom)
  return { x: x + offset.x, y: y + offset.y }
}
