import { EditorImage } from '../../editor-image'
import { EditorColor } from '../../editor-color'
import { formatRgbaColorAsHex } from '@/tools/utils/formatters'
import { EditorTool } from '../types'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'

interface EyeDropperToolOptions {
  color: EditorColor
  image: EditorImage
}

export class EyeDropperTool implements EditorTool {
  constructor({ image, color }: EyeDropperToolOptions) {
    this.#image = image
    this.#color = color
  }

  #color: EditorColor
  #image: EditorImage

  private async setPixelColor(x: number, y: number) {
    x = Math.floor(x)
    y = Math.floor(y)
    const imageWidth = this.#image.size.w
    const byteOffset = y * imageWidth * 4 + x * 4
    const color = {
      r: this.#image.imageBuffer[byteOffset + 0],
      g: this.#image.imageBuffer[byteOffset + 1],
      b: this.#image.imageBuffer[byteOffset + 2],
      a: this.#image.imageBuffer[byteOffset + 3],
    }
    // return if pixel is transparent (as user may have clicked on an unset background pixel)
    if (color.a === 0) return

    const hexColor = formatRgbaColorAsHex(color)
    this.#color.setPrimaryColor(hexColor)
  }

  public async onMouseDown(event: CanvasMouseEvent) {
    const clickCoords = getCanvasClickMouseCoords(event, this.#image.zoom)
    await this.setPixelColor(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public enable = () => {}

  public disable = () => {}

  public async onMouseMove(_: CanvasMouseEvent) {}

  public onMouseUp(_: CanvasMouseEvent) {}
}
