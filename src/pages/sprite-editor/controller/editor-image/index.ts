import { Box, Coordinates, Size } from '../../types'
import { minMax, toFixed, isEven } from '@/tools/utils/math'
import { DeepReadonly } from '@/types'
import { getBoxCenter } from '@/tools/utils/geometry'
import { EditorEventBus } from '../event-bus'

const BYTES_PER_PIXEL = 4
const INITIAL_ZOOM = 10
const ZOOM_DECIMALS_RESOLUTION = 2

interface EditorImageOptions {
  eventBus: EditorEventBus
}

export class EditorImage {
  constructor({ eventBus }: EditorImageOptions) {
    this.#eventBus = eventBus
  }
  #eventBus: EditorEventBus
  #size: Size = { w: 500, h: 500 }
  #zoom: number = INITIAL_ZOOM
  #viewBoxPosition: Coordinates = { x: 0, y: 0 }
  #imageBuffer = new Uint8ClampedArray(
    new ArrayBuffer(this.#size.w * this.#size.h * BYTES_PER_PIXEL)
  )

  public get viewBox(): DeepReadonly<Box> {
    const boxWidth = Math.floor(this.#size.w / this.#zoom)
    const boxHeight = Math.floor(this.#size.h / this.#zoom)
    return {
      position: this.#viewBoxPosition,
      size: {
        w: isEven(boxWidth) ? boxWidth - 1 : boxWidth,
        h: isEven(boxHeight) ? boxHeight - 1 : boxHeight,
      },
    }
  }

  public get size(): Readonly<Size> {
    return this.#size
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
    this.#eventBus.dispatch(
      this.#eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
      {}
    )
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
    this.#eventBus.dispatch(this.#eventBus.Event.IMAGE_ZOOM_CHANGE, {})
  }
}
