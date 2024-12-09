import { EditorTool } from './types/indx'
import { getLinePoints } from '@/tools/utils/geometry'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { Color, Coordinates } from '../../../types'
import { EditorHistory } from '../../action-history'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'

const isDistanceGreaterThanOne = (start: Coordinates, end: Coordinates) => {
  return Math.abs(start.x - end.x) > 1 || Math.abs(start.y - end.y) > 1
}

export class BrushTool implements EditorTool {
  constructor(
    editorImage: EditorImage,
    canvasMouse: CanvasMouse,
    actionHistory: EditorHistory
  ) {
    this.#editorImage = editorImage
    this.#canvasMouse = canvasMouse
    this.#history = actionHistory
  }

  #editorImage: EditorImage
  #canvasMouse: CanvasMouse
  #history: EditorHistory

  #color: Color = {
    r: 255,
    g: 255,
    b: 255,
    a: 255,
  }

  async #paintPixel(x: number, y: number) {
    x = Math.floor(x)
    y = Math.floor(y)
    const spriteWidth = 500
    const offset = y * spriteWidth * 4 + x * 4
    this.#editorImage.imageBuffer[offset + 0] = this.#color.r // red
    this.#editorImage.imageBuffer[offset + 1] = this.#color.g // green
    this.#editorImage.imageBuffer[offset + 2] = this.#color.b // blue
    this.#editorImage.imageBuffer[offset + 3] = this.#color.a // alpha
    this.#history.register('Draw')
  }

  public enable = () => {}

  public disable = () => {}

  public async onMouseMove(e: CanvasMouseEvent) {
    if (!this.#canvasMouse.isMouseDown) return

    // fill gaps with a line in case movement is too fast
    const clickCoords = getCanvasClickMouseCoords(e, this.#editorImage.zoom)
    const hasGaps = isDistanceGreaterThanOne(
      this.#canvasMouse.lastMouseCoords,
      clickCoords
    )
    if (!this.#canvasMouse.isFirstActionTick && hasGaps) {
      const points = getLinePoints(
        this.#canvasMouse.lastMouseCoords,
        clickCoords
      )
      for (const point of points) {
        await this.#paintPixel(
          point.x + this.#editorImage.viewBox.position.x,
          point.y + this.#editorImage.viewBox.position.y
        )
      }
    }
    // render the pixel
    await this.#paintPixel(
      clickCoords.x + this.#editorImage.viewBox.position.x,
      clickCoords.y + this.#editorImage.viewBox.position.y
    )
  }

  public async onMouseDown(e: CanvasMouseEvent) {
    const clickCoords = getCanvasClickMouseCoords(e, this.#editorImage.zoom)
    // render the pixel
    await this.#paintPixel(
      clickCoords.x + this.#editorImage.viewBox.position.x,
      clickCoords.y + this.#editorImage.viewBox.position.y
    )
  }

  public onMouseUp(_e: CanvasMouseEvent) {}
}
