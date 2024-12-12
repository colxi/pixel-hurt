import { EditorImage } from '../../editor-image'
import { EditorColor } from '../../editor-color'
import { formatRgbaColorAsHex } from '@/tools/utils/formatters'
import { EditorTool } from '../types'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { CanvasMouse } from '../../canvas-mouse'
import {
  getColorFromCoordinates,
  isTransparentColor,
} from '@/tools/utils/image'

interface EyeDropperToolOptions {
  color: EditorColor
  image: EditorImage
  mouse: CanvasMouse
}

export class EyeDropperTool implements EditorTool {
  constructor({ image, color, mouse }: EyeDropperToolOptions) {
    this.#image = image
    this.#color = color
    this.#mouse = mouse
  }

  #color: EditorColor
  #image: EditorImage
  #mouse: CanvasMouse

  private setPixelColor(x: number, y: number) {
    const color = getColorFromCoordinates(
      x,
      y,
      this.#image.size.w,
      this.#image.imageBuffer
    )
    if (isTransparentColor(color)) return
    const hexColor = formatRgbaColorAsHex(color)
    this.#color.setPrimaryColor(hexColor)
  }

  public onMouseDown(event: CanvasMouseEvent) {
    const clickCoords = getCanvasClickMouseCoords(event, this.#image.zoom)
    this.setPixelColor(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseMove(event: CanvasMouseEvent) {
    if (!this.#mouse.isMouseDown) return
    const clickCoords = getCanvasClickMouseCoords(event, this.#image.zoom)
    this.setPixelColor(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseUp(_: CanvasMouseEvent) {}

  public enable = () => {}

  public disable = () => {}
}
