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
import {
  getImageByteIndexFromCoordinates,
  getColorFromCoordinates,
  isTransparentColor,
} from '@/tools/utils/image'

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
    this.#isEyeDropperModeEnabled = false
  }

  #color: EditorColor
  #image: EditorImage
  #mouse: CanvasMouse
  #history: EditorHistory
  #isEyeDropperModeEnabled: boolean

  private paintPixel(x: number, y: number) {
    // If eye-dropper mode is enabled, get the color instead of painting it
    if (this.#isEyeDropperModeEnabled) {
      this.pickColorFromPixel(x, y)
      return
    }

    const byteIndex = getImageByteIndexFromCoordinates(x, y, this.#image.size.w)
    const color = formatHexColorAsRgba(this.#color.primaryColor)
    this.#image.imageBuffer[byteIndex + 0] = color.r // red
    this.#image.imageBuffer[byteIndex + 1] = color.g // green
    this.#image.imageBuffer[byteIndex + 2] = color.b // blue
    this.#image.imageBuffer[byteIndex + 3] = color.a // alpha
    this.#history.register('Draw')
  }

  private pickColorFromPixel(x: number, y: number) {
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

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft' && !hasKeyModifiers(e)) {
      this.#isEyeDropperModeEnabled = true
    }
  }

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft' && !hasKeyModifiers(e)) {
      this.#isEyeDropperModeEnabled = false
    }
  }

  public enable = () => {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  public disable = () => {
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
