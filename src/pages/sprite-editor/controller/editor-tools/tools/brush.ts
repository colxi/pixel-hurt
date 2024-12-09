import { getLinePoints, isDistanceGreaterThanOne } from '@/tools/utils/geometry'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { EditorHistory } from '../../action-history'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'
import { EditorColor } from '../../editor-color'
import {
  formatHexColorAsRgba,
  formatRgbaColorAsHex,
} from '@/tools/utils/formatters'
import { EditorTool } from '../types'
import { hasKeyModifiers } from '@/tools/utils/keyboard'

interface BrushToolOptions {
  color: EditorColor
  image: EditorImage
  history: EditorHistory
  mouse: CanvasMouse
}

export class BrushTool implements EditorTool {
  constructor({ image, mouse, history, color }: BrushToolOptions) {
    this.#image = image
    this.#mouse = mouse
    this.#history = history
    this.#color = color
    this.#isEyeDropEnabled = false
  }

  #color: EditorColor
  #image: EditorImage
  #mouse: CanvasMouse
  #history: EditorHistory
  #isEyeDropEnabled: boolean

  private paintPixel(x: number, y: number) {
    x = Math.floor(x)
    y = Math.floor(y)
    const imageWidth = this.#image.size.w
    const byteOffset = y * imageWidth * 4 + x * 4

    // If eye-dropper mode is enabled, get the color instead of painting it
    if (this.#isEyeDropEnabled) {
      this.getColorFromPixel(byteOffset)
      return
    }

    const color = formatHexColorAsRgba(this.#color.primaryColor)
    this.#image.imageBuffer[byteOffset + 0] = color.r // red
    this.#image.imageBuffer[byteOffset + 1] = color.g // green
    this.#image.imageBuffer[byteOffset + 2] = color.b // blue
    this.#image.imageBuffer[byteOffset + 3] = color.a // alpha
    this.#history.register('Draw')
  }

  private getColorFromPixel(byteOffset: number) {
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

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft' && !hasKeyModifiers(e)) {
      this.#isEyeDropEnabled = true
    }
  }

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft' && !hasKeyModifiers(e)) {
      this.#isEyeDropEnabled = false
    }
  }

  public enable = () => {
    console.log('enable')
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  public disable = () => {
    console.log('disable')
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
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
        this.paintPixel(
          point.x + this.#image.viewBox.position.x,
          point.y + this.#image.viewBox.position.y
        )
      }
    }

    this.paintPixel(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseDown(e: CanvasMouseEvent) {
    const clickCoords = getCanvasClickMouseCoords(e, this.#image.zoom)
    this.paintPixel(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseUp(_e: CanvasMouseEvent) {}
}
