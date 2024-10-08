import { useEvent } from '../../../../../tools/hooks'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { Color, Coordinates } from '../../../types'
import { ActionHistory } from '../../action-history'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'

/**
 *
 * Calculate the points of a line between two coordinates
 * and return an array of coordinates
 *
 */
function getLinePoints(start: Coordinates, end: Coordinates) {
  const xDistance = end.x - start.x
  const yDistance = end.y - start.y
  const hypotenuseLength = Math.sqrt(
    Math.pow(xDistance, 2) + Math.pow(yDistance, 2)
  )
  const data: Coordinates[] = []
  for (let i = 0; i < hypotenuseLength; i++) {
    const ratio = i / hypotenuseLength
    const smallerXLen = xDistance * ratio
    const smallerYLen = yDistance * ratio
    data.push({
      x: Math.round(start.x + smallerXLen),
      y: Math.round(start.y + smallerYLen),
    })
  }
  return data
}

const isDistanceGreaterThanOne = (start: Coordinates, end: Coordinates) => {
  return Math.abs(start.x - end.x) > 1 || Math.abs(start.y - end.y) > 1
}

export const useBrushTool = (
  editorImage: EditorImage,
  canvasMouse: CanvasMouse,
  actionHistory: ActionHistory
) => {
  const color: Color = {
    r: 255,
    g: 255,
    b: 255,
    a: 255,
  }

  const enable = () => {}

  const disable = () => {}

  const onMouseMove = useEvent(async (e: CanvasMouseEvent) => {
    if (!canvasMouse.isMouseDown) return

    // fill gaps with a line in case movement is too fast
    const clickCoords = getCanvasClickMouseCoords(e, editorImage.zoom)
    const hasGaps = isDistanceGreaterThanOne(
      canvasMouse.lastMouseCoords,
      clickCoords
    )
    if (!canvasMouse.isFirstActionTick && hasGaps) {
      const points = getLinePoints(canvasMouse.lastMouseCoords, clickCoords)
      for (const point of points) {
        await paintPixel(
          point.x + editorImage.viewBox.position.x,
          point.y + editorImage.viewBox.position.y
        )
      }
    }
    // render the pixel
    await paintPixel(
      clickCoords.x + editorImage.viewBox.position.x,
      clickCoords.y + editorImage.viewBox.position.y
    )
  })

  const onMouseDown = useEvent(async (e: CanvasMouseEvent) => {
    const clickCoords = getCanvasClickMouseCoords(e, editorImage.zoom)
    // render the pixel
    await paintPixel(
      clickCoords.x + editorImage.viewBox.position.x,
      clickCoords.y + editorImage.viewBox.position.y
    )
  })

  const onMouseUp = useEvent((_e: CanvasMouseEvent) => {})

  const paintPixel = async (x: number, y: number) => {
    const spriteWidth = 500
    const offset = y * spriteWidth * 4 + x * 4
    editorImage.imageBuffer[offset + 0] = color.r // red
    editorImage.imageBuffer[offset + 1] = color.g // green
    editorImage.imageBuffer[offset + 2] = color.b // blue
    editorImage.imageBuffer[offset + 3] = color.a // alpha
    actionHistory.register('Draw')
  }

  return {
    enable,
    disable,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  }
}
