import { useMemo, useState } from 'react'
import { Box, Coordinates, Size } from '../../types'
import { minMax, toFixed, isEven } from '@/tools/utils/math'
import { DeepReadonly } from '@/types'
import { getBoxCenter } from '@/tools/utils/geometry'

export type UseEditorImage = ReturnType<typeof useEditorImage>

const BYTES_PER_PIXEL = 4
const INITIAL_ZOOM = 10
const ZOOM_DECIMALS_RESOLUTION = 2

export class EditorImage {
  #width: number = 500
  #height: number = 500
  #zoom: number = INITIAL_ZOOM
  #viewBoxPosition: Coordinates = { x: 0, y: 0 }
  #imageBuffer = new Uint8ClampedArray(
    new ArrayBuffer(this.#width * this.#height * BYTES_PER_PIXEL)
  )

  public get viewBox(): DeepReadonly<Box> {
    const boxWidth = Math.floor(this.#width / this.#zoom)
    const boxHeight = Math.floor(this.#height / this.#zoom)
    return {
      position: this.#viewBoxPosition,
      size: {
        w: isEven(boxWidth) ? boxWidth - 1 : boxWidth,
        h: isEven(boxHeight) ? boxHeight - 1 : boxHeight,
      },
    }
  }

  public get width() {
    return this.#width
  }

  public get height() {
    return this.#height
  }

  public get zoom() {
    return this.#zoom
  }

  public get imageBuffer(): Uint8ClampedArray {
    return this.#imageBuffer
  }

  public setViewBoxPosition(coords: Coordinates) {
    this.#viewBoxPosition.x = coords.x
    this.#viewBoxPosition.y = coords.y
  }

  public setZoom(zoomLevel: number, zoomAt?: Coordinates): void {
    const zoomNew = toFixed(
      minMax({ value: zoomLevel, min: 1, max: 30 }),
      ZOOM_DECIMALS_RESOLUTION
    )

    const viewBox = this.viewBox
    const viewBoxCenter = getBoxCenter(viewBox)
    let zoomAtX = zoomAt ? zoomAt.x : viewBoxCenter.x
    let zoomAtY = zoomAt ? zoomAt.y : viewBoxCenter.y
    const viewBoxPositionNew = {
      x: viewBox.position.x + zoomAtX / this.#zoom - zoomAtX / zoomNew,
      y: viewBox.position.y + zoomAtY / this.#zoom - zoomAtY / zoomNew,
    }

    this.setViewBoxPosition(viewBoxPositionNew)
    this.#zoom = zoomNew
  }
}

export const useEditorImage = () => {
  const [width] = useState(500)
  const [height] = useState(500)
  const [zoom, setZoomLevel] = useState(INITIAL_ZOOM)
  const [imageBuffer] = useState(
    new Uint8ClampedArray(new ArrayBuffer(width * height * BYTES_PER_PIXEL))
  )
  const [viewBoxPosition, setViewBoxPosition] = useState<Coordinates>({
    x: 0,
    y: 0,
  })

  const getViewBoxSize = (zoomLevel = zoom) => {
    const boxWidth = Math.floor(width / zoomLevel)
    const boxHeight = Math.floor(height / zoomLevel)
    let value = {
      w: isEven(boxWidth) ? boxWidth - 1 : boxWidth,
      h: isEven(boxHeight) ? boxHeight - 1 : boxHeight,
    }
    return value
  }

  const viewBoxSize = useMemo<Size>(getViewBoxSize, [width, zoom])

  const getBoxCenter = (position: Coordinates, size: Size): Coordinates => ({
    x: Math.ceil(position.x + size.w / 2),
    y: Math.ceil(position.y + size.h / 2),
  })

  const setZoom = (zoomLevel: number, zoomAt?: Coordinates) => {
    const zoomNew = toFixed(
      minMax({ value: zoomLevel, min: 1, max: 30 }),
      ZOOM_DECIMALS_RESOLUTION
    )

    let zoomAtX = zoomAt
      ? zoomAt.x
      : getBoxCenter(viewBoxPosition, viewBoxSize).x
    let zoomAtY = zoomAt
      ? zoomAt.y
      : getBoxCenter(viewBoxPosition, viewBoxSize).y
    const viewBoxPositionNew = {
      x: viewBoxPosition.x + zoomAtX / zoom - zoomAtX / zoomNew,
      y: viewBoxPosition.y + zoomAtY / zoom - zoomAtY / zoomNew,
    }
    setViewBoxPosition(viewBoxPositionNew)
    setZoomLevel(zoomNew)

    // const zoomWithLimits = minMax({ value: zoomNew, min: 1, max: 30 })
    // const newZoomWithFixedDecimals = Number(zoomWithLimits.toFixed(2))

    // const centerCurrent = getBoxCenter(viewBoxPosition, viewBoxSize)
    // const sizeNew = getViewBoxSize(newZoomWithFixedDecimals)
    // const positionNew = {
    //   x: Math.floor(centerCurrent.x - sizeNew.w / 2),
    //   y: Math.floor(centerCurrent.y - sizeNew.h / 2),
    // }

    // const centerNew = getBoxCenter(positionNew, sizeNew)
    // const centerDiff = {
    //   x: centerCurrent.x - centerNew.x,
    //   y: centerCurrent.y - centerNew.y,
    // }
    // const positionCorrected = {
    //   x: positionNew.x + centerDiff.x,
    //   y: positionNew.y + centerDiff.y,
    // }
    // setViewBoxPosition(positionCorrected)
    // setZoomLevel(newZoomWithFixedDecimals)
  }

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

/*

    const newViewBoxSize = {
      w: Math.floor(editorImage.width / newZoom),
      h: Math.floor(editorImage.height / newZoom),
    }
    const widthDiff = editorImage.viewBox.size.w - newViewBoxSize.w
    const heightDiff = editorImage.viewBox.size.h - newViewBoxSize.h
    updateViewBoxCoordinates(
      {
        x: editorImage.viewBox.position.x + Math.floor(widthDiff / 2),
        y: editorImage.viewBox.position.y + Math.floor(heightDiff / 2),
      }
    )
      */
