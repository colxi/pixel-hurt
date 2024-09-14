import { useState } from 'react'
import { useEvent } from '../../../../../tools/hooks'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { CanvasMouse } from '../../canvas-mouse'
import { EditorImage } from '../../editor-image'

export const useHandTool = (
  editorImage: EditorImage,
  canvasMouse: CanvasMouse
) => {
  const [lastMouseCoords, setLastMouseCoords] = useState({ x: 0, y: 0 })

  const enable = () => {}

  const disable = () => {}

  const onMouseMove = useEvent(async (e: CanvasMouseEvent) => {
    if (!canvasMouse.isMouseDown) return
    const coords = getCanvasClickMouseCoords(e, editorImage.zoom)
    const xDiff = lastMouseCoords.x - coords.x
    const yDiff = lastMouseCoords.y - coords.y
    editorImage.setViewBoxPosition({
      x: editorImage.viewBox.position.x + xDiff,
      y: editorImage.viewBox.position.y + yDiff,
    })
    setLastMouseCoords(coords)
  })

  const onMouseDown = useEvent((e: CanvasMouseEvent) => {
    const coords = getCanvasClickMouseCoords(e, editorImage.zoom)
    setLastMouseCoords(coords)
  })

  const onMouseUp = useEvent((_e: CanvasMouseEvent) => {})

  return {
    enable,
    disable,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  }
}
