import { Coordinates, HexColor, RgbaColor } from '@/pages/sprite-editor/types'
import { formatHexColorAsRgba } from './formatters'

export const getImageByteIndexFromCoordinates = (
  x: number,
  y: number,
  imageWidth: number
): number => {
  x = Math.floor(x)
  y = Math.floor(y)
  imageWidth = Math.floor(imageWidth)
  const byteOffset = y * imageWidth * 4 + x * 4
  return byteOffset
}

export const getCoordinatesFromImageByteIndex = (
  byteIndex: number,
  imageWidth: number
): Coordinates => {
  const bytesPerRow = imageWidth * 4
  const y = Math.floor(byteIndex / bytesPerRow)
  const x = (byteIndex % bytesPerRow) / 4
  return { x, y }
}

export const isTransparentColor = (color: RgbaColor | HexColor): boolean => {
  if (typeof color === 'string') color = formatHexColorAsRgba(color)
  return color.a === 0
}

export const getColorFromCoordinates = (
  x: number,
  y: number,
  imageWidth: number,
  imageBuffer: Uint8ClampedArray
): RgbaColor => {
  const byteIndex = getImageByteIndexFromCoordinates(x, y, imageWidth)
  const color = {
    r: imageBuffer[byteIndex + 0],
    g: imageBuffer[byteIndex + 1],
    b: imageBuffer[byteIndex + 2],
    a: imageBuffer[byteIndex + 3],
  }
  return color
}

export const getColorFromByteIndex = (
  byteIndex: number,
  imageBuffer: Uint8ClampedArray
): RgbaColor => {
  const color: RgbaColor = {
    r: imageBuffer[byteIndex + 0],
    g: imageBuffer[byteIndex + 1],
    b: imageBuffer[byteIndex + 2],
    a: imageBuffer[byteIndex + 3],
  }
  return color
}

export const setColorInCoordinates = (
  x: number,
  y: number,
  imageWidth: number,
  imageBuffer: Uint8ClampedArray,
  color: RgbaColor
): void => {
  const byteIndex = getImageByteIndexFromCoordinates(x, y, imageWidth)
  imageBuffer[byteIndex + 0] = color.r
  imageBuffer[byteIndex + 1] = color.g
  imageBuffer[byteIndex + 2] = color.b
  imageBuffer[byteIndex + 3] = color.a
}

export const isColorEqual = (
  color1: RgbaColor | HexColor,
  color2: RgbaColor | HexColor
): boolean => {
  if (typeof color1 === 'string') color1 = formatHexColorAsRgba(color1)
  if (typeof color2 === 'string') color2 = formatHexColorAsRgba(color2)
  return (
    color1.r === color2.r &&
    color1.g === color2.g &&
    color1.b === color2.b &&
    color1.a === color2.a
  )
}
