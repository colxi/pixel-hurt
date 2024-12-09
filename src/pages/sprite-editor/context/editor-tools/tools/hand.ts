import { Coordinates } from '@/pages/sprite-editor/types'
import { useState } from 'react'
import { useEvent } from '../../../../../tools/hooks'
import {
  CanvasMouseEvent,
  getCanvasClickMouseCoords,
} from '../../../presentation/utils'
import { CanvasMouse, CanvasMouseContext } from '../../canvas-mouse'
import { EditorImage, UseEditorImage } from '../../editor-image'
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

  public onMouseUp = useEvent((_e: CanvasMouseEvent) => {})
}

export const useHandTool = (
  editorImage: UseEditorImage,
  canvasMouse: CanvasMouseContext
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
