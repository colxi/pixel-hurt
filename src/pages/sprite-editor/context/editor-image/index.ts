import { useMemo, useState } from 'react'
import { Coordinates, Size } from '../../types'
import { size } from 'lodash-es'

export type EditorImage = ReturnType<typeof useEditorImage>

const BYTES_PER_PIXEL = 4
const INITIAL_ZOOM = 10

export const useEditorImage = () => {
  const [width] = useState(500)
  const [height] = useState(500)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [imageBuffer] = useState(
    new Uint8ClampedArray(new ArrayBuffer(width * height * BYTES_PER_PIXEL))
  )
  const [viewBoxPosition, setViewBoxPosition] = useState<Coordinates>({
    x: 0,
    y: 0,
  })
  const viewBoxSize = useMemo<Size>(
    () => ({
      w: Math.floor(width / zoom),
      h: Math.floor(height / zoom),
    }),
    [width, zoom]
  )

  return {
    setViewBoxPosition,
    setZoom,
    zoom,
    width,
    height,
    imageBuffer,
    viewBox: {
      size: viewBoxSize,
      position: viewBoxPosition,
    },
  }
}
