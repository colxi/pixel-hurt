import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSpriteEditorContext } from '../../context'
import { SpriteCanvasContainer, SpriteCanvasUI } from './SpriteEditorCanvas.styles'
import { useSpriteEditorCanvasKeyBindings } from './SpriteEditorCanvas.keyBindings'
import { CanvasMouseEvent, getCanvasClickMouseCoords } from '../utils'
import { PersistentCanvas } from '../../../../tools/ui-components/persistent-canvas/PersistentCanvas'
import { useEvent } from '../../../../tools/hooks'
import { AnimationEngine } from '../../../../tools/utils/animation-engine'
import { Size } from '../../types'
import { minMax } from '../../../../tools/utils/math'

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

  const [viewportSize] = useState<Size>({ w: 500, h: 500 })
  const [canvasMouseCoords, setCanvasMouseCoords] = useState({ x: 0, y: 0 })
  const [imageCanvasContext, setImageCanvasContext] = useState<CanvasRenderingContext2D | null>()
  const animation = useMemo(() => new AnimationEngine('ImageEditor'), [])
  const canvasUIRef = useRef<HTMLCanvasElement>(null)

  const getUICanvasContext = () => {
    const canvas = canvasUIRef.current
    if (!canvas) throw new Error('Canvas not found')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Context not found')
    return context
  }


  const handleCanvasMouseMove = async (e: CanvasMouseEvent) => {
    const { x, y } = getCanvasClickMouseCoords(e, editorImage.zoom)
    setCanvasMouseCoords({ x, y })
    renderCursor(x, y)
    editorTools.tool[editorTools.activeEditorTool].onMouseMove(e)

    canvasMouse.setLastMouseCoords({ x, y })
    canvasMouse.setIsFirstActionTick(false)
  }

  const handleCanvasClick = async (e: CanvasMouseEvent) => {
    canvasMouse.setMouseDown()
    editorTools.tool[editorTools.activeEditorTool].onMouseDown(e)
  }

  const renderCursor = (x: number, y: number) => {
    const context = getUICanvasContext()
    context.strokeStyle = 'red'
    context.clearRect(0, 0, editorImage.width, editorImage.height)
    context.beginPath()
    context.strokeRect(x * editorImage.zoom, y * editorImage.zoom, 1 * editorImage.zoom, 1 * editorImage.zoom)
    context.stroke()
    context.closePath()
  }

  const renderCanvas = async () => {
    if (!imageCanvasContext) return

    // paint the background in pink to show the viewport
    imageCanvasContext.fillStyle = '#bf4f74'
    imageCanvasContext.rect(
      0,
      0,
      viewportSize.w / editorImage.zoom,
      viewportSize.h / editorImage.zoom
    )
    imageCanvasContext.fill()
    // clear the part of the canvas that has data in the buffer.
    // Coordinates that are before or after the actual viewport are not cleared
    imageCanvasContext.clearRect(
      editorImage.viewBox.position.x > 0 ? 0 : Math.abs(editorImage.viewBox.position.x),
      editorImage.viewBox.position.y > 0 ? 0 : Math.abs(editorImage.viewBox.position.y),
      editorImage.viewBox.size.w + editorImage.viewBox.position.x > viewportSize.w
        ? (viewportSize.w / editorImage.zoom) - (editorImage.viewBox.position.x + editorImage.viewBox.size.w - viewportSize.w)
        : viewportSize.w / editorImage.zoom,
      editorImage.viewBox.size.h + editorImage.viewBox.position.y > viewportSize.h
        ? (viewportSize.h / editorImage.zoom) - (editorImage.viewBox.position.y + editorImage.viewBox.size.h - viewportSize.h)
        : viewportSize.h / editorImage.zoom,
    )


    // copy the image fom the buffer to the canvas
    const imageData = new ImageData(
      editorImage.imageBuffer,
      editorImage.width,
      editorImage.height
    )
    const bitmap = await createImageBitmap(
      imageData,
      editorImage.viewBox.position.x,
      editorImage.viewBox.position.y,
      editorImage.width,
      editorImage.height,
    )
    imageCanvasContext.drawImage(bitmap, 0, 0)
  }

  const animationTick = useEvent(() => {
    renderCanvas()
    animation.requestFrame(animationTick)
  })

  const setCanvasZoom = useEvent(() => {
    if (!imageCanvasContext) return
    imageCanvasContext.resetTransform()
    imageCanvasContext.scale(editorImage.zoom, editorImage.zoom)
  })

  useEffect(() => {
    if (!imageCanvasContext) return
    setCanvasZoom()
    animationTick()
  }, [
    imageCanvasContext,
    editorImage.zoom,
    actionHistory.currentIndex,
    editorImage.viewBox.position
  ])


  const handleWheelGesture = useEvent((event: WheelEvent) => {
    const isZoomGesture = event.ctrlKey
    if (!isZoomGesture) return
    const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1
    const newZoom = minMax({ value: editorImage.zoom + zoomAmount, min: 1, max: 30 })
    console.log(newZoom)
    editorImage.setZoom(newZoom)
  })

  useEffect(() => {
    if (!canvasUIRef.current) throw new Error('Canvas UI not found')
    window.addEventListener('mouseup', canvasMouse.setMouseUp)
    const uiContext = getUICanvasContext()
    uiContext.imageSmoothingEnabled = false
    actionHistory.register('Create')
    canvasUIRef.current.addEventListener('wheel', handleWheelGesture, { passive: false })
    return () => {
      animation.stop()
      window.removeEventListener('mouseup', canvasMouse.setMouseUp)
      canvasUIRef.current?.removeEventListener('wheel', handleWheelGesture)
    }
  }, [])

  return (
    <>
      <div>
        <SpriteCanvasContainer>
          <SpriteCanvasUI
            ref={canvasUIRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseDown={handleCanvasClick}
            width={viewportSize.w}
            height={viewportSize.h}
          />
          <PersistentCanvas
            contextRef={setImageCanvasContext}
            width={viewportSize.w}
            height={viewportSize.h}
          />

        </SpriteCanvasContainer>
        <div>Mouse:{editorTools.activeEditorTool} / {canvasMouseCoords.x}-{canvasMouseCoords.y}</div>
      </div>
    </>
  )
}

