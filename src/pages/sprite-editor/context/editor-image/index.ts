import { useState } from 'react'
import { Coordinates } from '../../types'

export type EditorImage = ReturnType<typeof useEditorImage>

export const useEditorImage = () => {
  const [width] = useState(500)
  const [height] = useState(500)
  const [zoom] = useState(10)
  const [imageBuffer] = useState(
    new Uint8ClampedArray(new ArrayBuffer(width * height * 4))
  )
  const [viewBoxCoords, setViewBoxCoords] = useState<Coordinates>({
    x: 0,
    y: 0,
  })

  return {
    setViewBoxCoords,
    width,
    height,
    zoom,
    viewBoxCoords,
    imageBuffer,
  }
}
