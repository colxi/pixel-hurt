import { getLinePoints, isDistanceGreaterThanOne } from '@/tools/utils/geometry'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { EditorHistory } from '../../action-history'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'
import { EditorTool } from '../types'
import { getImageByteIndexFromCoordinates } from '@/tools/utils/image'

interface EraserToolOptions {
  image: EditorImage
  history: EditorHistory
  mouse: CanvasMouse
}

export class EraserTool implements EditorTool {
  constructor({ image, mouse, history }: EraserToolOptions) {
    this.#image = image
    this.#mouse = mouse
    this.#history = history
  }

  #image: EditorImage
  #mouse: CanvasMouse
  #history: EditorHistory

  private erasePixel(x: number, y: number) {
    const byteIndex = getImageByteIndexFromCoordinates(x, y, this.#image.size.w)
    this.#image.imageBuffer[byteIndex + 0] = 0 // red
    this.#image.imageBuffer[byteIndex + 1] = 0 // green
    this.#image.imageBuffer[byteIndex + 2] = 0 // blue
    this.#image.imageBuffer[byteIndex + 3] = 0 // alpha
    this.#history.register('Erase')
  }

  public onMouseMove(e: CanvasMouseEvent) {
    if (!this.#mouse.isMouseDown) return

    // fill gaps with a line in case movement is too fast
    const clickCoords = getCanvasClickMouseCoords(e, this.#image.zoom)
    const hasGaps = isDistanceGreaterThanOne(
      this.#mouse.lastMouseCoords,
      clickCoords
    )
    if (!this.#mouse.isFirstActionTick && hasGaps) {
      const points = getLinePoints(this.#mouse.lastMouseCoords, clickCoords)
      for (const point of points) {
        this.erasePixel(
          point.x + this.#image.viewBox.position.x,
          point.y + this.#image.viewBox.position.y
        )
      }
    }

    this.erasePixel(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseDown(e: CanvasMouseEvent) {
    const clickCoords = getCanvasClickMouseCoords(e, this.#image.zoom)
    this.erasePixel(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseUp(_e: CanvasMouseEvent) {}

  public enable = () => {}

  public disable = () => {}
}
