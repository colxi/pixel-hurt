import { Coordinates } from '@/pages/sprite-editor/types'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'
import { EditorTool } from './types/indx'

export class HandTool implements EditorTool {
  constructor(editorImage: EditorImage, canvasMouse: CanvasMouse) {
    this.#editorImage = editorImage
    this.#canvasMouse = canvasMouse
  }

  #editorImage: EditorImage
  #canvasMouse: CanvasMouse
  #lastMouseCoords: Coordinates = { x: 0, y: 0 }

  public enable = () => {}

  public disable = () => {}

  public async onMouseMove(e: CanvasMouseEvent) {
    if (!this.#canvasMouse.isMouseDown) return
    const coords = getCanvasClickMouseCoords(e, this.#editorImage.zoom)
    const xDiff = this.#lastMouseCoords.x - coords.x
    const yDiff = this.#lastMouseCoords.y - coords.y
    this.#editorImage.setViewBoxPosition({
      x: this.#editorImage.viewBox.position.x + xDiff,
      y: this.#editorImage.viewBox.position.y + yDiff,
    })
    this.#lastMouseCoords = coords
  }

  public onMouseDown(e: CanvasMouseEvent) {
    const coords = getCanvasClickMouseCoords(e, this.#editorImage.zoom)
    this.#lastMouseCoords = coords
  }

  public onMouseUp(_e: CanvasMouseEvent) {}
}
