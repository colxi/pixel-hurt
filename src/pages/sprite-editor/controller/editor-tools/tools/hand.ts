import { Coordinates } from '@/pages/sprite-editor/types'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'
import { EditorTool } from '../types'

interface HandToolOptions {
  image: EditorImage
  mouse: CanvasMouse
}

export class HandTool implements EditorTool {
  constructor({ image, mouse }: HandToolOptions) {
    this.#image = image
    this.#mouse = mouse
  }

  #image: EditorImage
  #mouse: CanvasMouse
  #lastMouseCoords: Coordinates = { x: 0, y: 0 }

  public async onMouseMove(event: CanvasMouseEvent) {
    if (!this.#mouse.isMouseDown) return
    const coords = getCanvasClickMouseCoords(event, this.#image.zoom)
    const xDiff = this.#lastMouseCoords.x - coords.x
    const yDiff = this.#lastMouseCoords.y - coords.y
    this.#image.setViewBoxPosition({
      x: this.#image.viewBox.position.x + xDiff,
      y: this.#image.viewBox.position.y + yDiff,
    })
    this.#lastMouseCoords = coords
  }

  public onMouseDown(event: CanvasMouseEvent) {
    const coords = getCanvasClickMouseCoords(event, this.#image.zoom)
    this.#lastMouseCoords = coords
  }

  public enable = () => {}

  public disable = () => {}

  public onMouseUp(_event: CanvasMouseEvent) {}
}
