import { hasKeyModifiers } from '@/tools/utils/keyboard'
import { formatRgbaColorAsHex } from '@/tools/utils/formatters'
import { getColorFromByteIndex } from '@/tools/utils/image'
import {
  getImageByteIndexFromCoordinates,
  getColorFromCoordinates,
  isColorEqual,
  isTransparentColor,
  setColorInCoordinates,
  getCoordinatesFromImageByteIndex,
} from '@/tools/utils/image'
import { RgbaColor } from '@/pages/sprite-editor/types'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { EditorHistory } from '../../action-history'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'
import { EditorColor } from '../../editor-color'
import { EditorTool } from '../types'

interface PaintBucketToolOptions {
  color: EditorColor
  image: EditorImage
  history: EditorHistory
  mouse: CanvasMouse
}

export class PaintBucketTool implements EditorTool {
  constructor({ image, mouse, history, color }: PaintBucketToolOptions) {
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

  private fill(x: number, y: number) {
    // If eye-dropper mode is enabled, get the color instead of painting it
    if (this.#isEyeDropperModeEnabled) {
      this.pickColorFromPixel(x, y)
      return
    }

    const pixelColor = getColorFromCoordinates(
      x,
      y,
      this.#image.size.w,
      this.#image.imageBuffer
    )
    // if is same color, no action is needed, return
    if (isColorEqual(pixelColor, this.#color.primaryColor)) return
    this.floodFill(x, y, pixelColor)
    this.#history.register('Fill')
  }

  private floodFill = (x: number, y: number, targetColor: RgbaColor) => {
    const canFillPixel = (byteIndex: number) => {
      const pixelColor = getColorFromByteIndex(
        byteIndex,
        this.#image.imageBuffer
      )
      return isColorEqual(pixelColor, targetColor)
    }

    const stack: number[] = [
      getImageByteIndexFromCoordinates(x, y, this.#image.size.w),
    ]

    while (stack.length) {
      let byteIndex = stack.pop()!
      const { x, y } = getCoordinatesFromImageByteIndex(
        byteIndex,
        this.#image.size.w
      )
      setColorInCoordinates(
        x,
        y,
        this.#image.size.w,
        this.#image.imageBuffer,
        this.#color.primaryColor
      )

      // evaluate all directions
      const rightPixelIndex = byteIndex + 4
      if (canFillPixel(rightPixelIndex)) stack.push(rightPixelIndex)
      const leftPixelIndex = byteIndex - 4
      if (canFillPixel(leftPixelIndex)) stack.push(leftPixelIndex)
      const topPixelIndex = byteIndex - this.#image.size.w * 4
      if (canFillPixel(topPixelIndex)) stack.push(topPixelIndex)
      const bottomPixelIndex = byteIndex + this.#image.size.w * 4
      if (canFillPixel(bottomPixelIndex)) stack.push(bottomPixelIndex)
    }
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
    if (!this.#mouse.isMouseDown || !this.#isEyeDropperModeEnabled) return
    const { x, y } = getCanvasClickMouseCoords(e, this.#image.zoom)
    this.pickColorFromPixel(x, y)
  }

  public onMouseDown(e: CanvasMouseEvent) {
    const clickCoords = getCanvasClickMouseCoords(e, this.#image.zoom)
    this.fill(
      clickCoords.x + this.#image.viewBox.position.x,
      clickCoords.y + this.#image.viewBox.position.y
    )
  }

  public onMouseUp(_e: CanvasMouseEvent) {}
}
