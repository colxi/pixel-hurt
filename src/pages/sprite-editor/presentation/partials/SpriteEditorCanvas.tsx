import type { FC, MouseEvent } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useSpriteEditorContext } from '../../context'
import { SpriteCanvas, SpriteCanvasContainer, SpriteCanvasUI } from './SpriteEditorCanvas.styles'
import { Coordinates, SpriteEditorTool } from '../../types'
import { useSpriteEditorCanvasKeyBindings } from './SpriteEditorCanvas.keyBindings'
import { CanvasMouseEvent, getCanvasClickMouseCoords } from '../utils'
import { PersistentCanvas } from './PersistentCanvas'

function getLinePoint(start: Coordinates, end: Coordinates) {
  const xDistance = end.x - start.x
  const yDistance = end.y - start.y
  const hypotenuseLength = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
  const data: Coordinates[] = []
  for (let i = 0; i < hypotenuseLength; i++) {
    const ratio = i / hypotenuseLength
    const smallerXLen = xDistance * ratio
    const smallerYLen = yDistance * ratio
    data.push({
      x: Math.round(start.x + smallerXLen),
      y: Math.round(start.y + smallerYLen)
    })
  }
  return data
}


const throwError = (e: unknown) => {
  throw e
}

export const SpriteEditorCanvas: FC = () => {
  const {
    editorTools,
    actionHistory,
    editorImage,
    canvasMouse
  } = useSpriteEditorContext()

  useSpriteEditorCanvasKeyBindings({
    undo: actionHistory.undo,
    redo: actionHistory.redo
  })


  const [canvasMouseCoords, setCanvasMouseCoords] = useState({ x: 0, y: 0 })
  const [canvasZoom, setCanvasZoom] = useState(10)
  const [requestAnimationFrameId, setRequestAnimationFrameId] = useState<number>(0)

  const canvasUIRef = useRef<HTMLCanvasElement>(null)
  const [imageCanvasContext, setImageCanvasContext] = useState<CanvasRenderingContext2D | null>()

  const getUICanvasContext = () => {
    const canvas = canvasUIRef.current
    if (!canvas) throw new Error('Canvas not found')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Context not found')
    return context
  }


  const onCanvasMouseMove = async (e: CanvasMouseEvent) => {
    const { x, y } = getCanvasClickMouseCoords(e, canvasZoom)
    setCanvasMouseCoords({ x, y })
    renderCursor(x, y)

    editorTools.tool[editorTools.activeEditorTool].onMouseMove(e)

    canvasMouse.setLastMouseCoords({ x, y })
    canvasMouse.setIsFirstActionTick(false)
  }

  const onCanvasClick = async (e: CanvasMouseEvent) => {
    // const { x, y } = getCanvasClickMouseCoords(e, canvasZoom)
    // switch (editorTools.activeEditorTool) {
    //   case SpriteEditorTool.BRUSH:
    //     await draw(x, y)
    //     break
    //   case SpriteEditorTool.ERASER:
    //     await erase(x, y)
    //     break
    // }
  }

  const renderCursor = (x: number, y: number) => {
    const context = getUICanvasContext()
    context.strokeStyle = 'red'
    context.clearRect(0, 0, editorImage.width, editorImage.height)
    context.beginPath()
    context.strokeRect(x * canvasZoom, y * canvasZoom, 1 * canvasZoom, 1 * canvasZoom)
    context.stroke()
    context.closePath()
  }

  const draw = async (x: number, y: number) => {
    // await paintPixel(x + viewBoxCoords.x, y + viewBoxCoords.y, { r: 255, g: 255, b: 255, a: 255 })
    // registerChanges('Draw')
  }

  const erase = async (x: number, y: number) => {
    // await paintPixel(x + viewBoxCoords.x, y + viewBoxCoords.y, { r: 0, g: 0, b: 0, a: 0 })
    // registerChanges('Erase')
  }

  const redrawCanvas = async () => {
    if (!imageCanvasContext) return
    // clear the canvas
    imageCanvasContext.clearRect(0, 0, editorImage.width, editorImage.height)
    // copy the image fom the buffer to the canvas
    const imageData = new ImageData(editorImage.imageBuffer, editorImage.width, editorImage.height)
    const bitmap = await createImageBitmap(
      imageData,
      editorImage.viewBoxCoords.x,
      editorImage.viewBoxCoords.y,
      editorImage.width,
      editorImage.height
    )
    imageCanvasContext.drawImage(bitmap, 0, 0)
    // request next animation frame
    const id = requestAnimationFrame(redrawCanvas)
    setRequestAnimationFrameId(id)
  }


  const requestFrame = () => {
    cancelAnimationFrame(requestAnimationFrameId)
    const id = requestAnimationFrame(redrawCanvas)
    setRequestAnimationFrameId(id)
  }

  useEffect(() => {
    if (!imageCanvasContext) return
    imageCanvasContext.imageSmoothingEnabled = false
    imageCanvasContext.resetTransform()
    imageCanvasContext.scale(canvasZoom, canvasZoom)
    requestFrame()
  }, [
    imageCanvasContext
  ])

  useEffect(() => {
    requestFrame()
  }, [
    actionHistory.currentIndex,
    editorImage.viewBoxCoords
  ]
  )

  useEffect(() => {
    window.addEventListener('mouseup', canvasMouse.setMouseUp)
    const uiContext = getUICanvasContext()
    uiContext.imageSmoothingEnabled = false
    actionHistory.register('Create')

    return () => {
      cancelAnimationFrame(requestAnimationFrameId)
      window.removeEventListener('mouseup', canvasMouse.setMouseUp)
    }
  }, [])

  return (
    <>
      <div>
        <SpriteCanvasContainer>
          {/* <SpriteCanvas ref={canvasSpriteRef} width={spriteWidth} height={spriteHeight} /> */}

          <SpriteCanvasUI
            ref={canvasUIRef}
            onMouseMove={onCanvasMouseMove}
            onMouseDown={canvasMouse.setMouseDown}
            onClick={onCanvasClick}
            width={editorImage.width}
            height={editorImage.height}
          />
          <PersistentCanvas
            contextRef={setImageCanvasContext}
            width={editorImage.width}
            height={editorImage.height}
          />

        </SpriteCanvasContainer>
        <div>Mouse:{editorTools.activeEditorTool} / {canvasMouseCoords.x}-{canvasMouseCoords.y}</div>
      </div>
    </>
  )
}

