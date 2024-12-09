import { Box, Coordinates } from '@/pages/sprite-editor/types'

export const getBoxCenter = (box: Box): Readonly<Coordinates> => {
  return {
    x: Math.ceil(box.position.x + box.size.w / 2),
    y: Math.ceil(box.position.y + box.size.h / 2),
  }
}

/**
 *
 * Calculate the points of a line between two coordinates
 * and return an array of coordinates
 *
 */
export const getLinePoints = (
  start: Coordinates,
  end: Coordinates
): Coordinates[] => {
  const xDistance = end.x - start.x
  const yDistance = end.y - start.y
  const hypotenuseLength = Math.sqrt(
    Math.pow(xDistance, 2) + Math.pow(yDistance, 2)
  )
  const data: Coordinates[] = []
  for (let i = 0; i < hypotenuseLength; i++) {
    const ratio = i / hypotenuseLength
    const smallerXLen = xDistance * ratio
    const smallerYLen = yDistance * ratio
    data.push({
      x: Math.round(start.x + smallerXLen),
      y: Math.round(start.y + smallerYLen),
    })
  }
  return data
}
