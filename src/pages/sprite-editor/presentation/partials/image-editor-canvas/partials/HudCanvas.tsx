import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styles from './HudCanvas.module.scss'
import { useSpriteEditorCanvasKeyBindings } from '../.././SpriteEditorCanvas.keyBindings'
import { CanvasMouseEvent, getCanvasClickMouseCoords, getCanvasImageCoords } from '../../../utils'
import { AnimationEngine } from '@/tools/utils/animation-engine'
import { Size } from '../../../../types'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { ImageEditor } from '@/pages/sprite-editor/controller'
import { useEvent } from '@/tools/hooks'

export const HudCanvas: FC = () => {
  useSpriteEditorCanvasKeyBindings({
    undo: ImageEditor.history.undo,
    redo: ImageEditor.history.redo
  })

  const [isMOuseOverCanvas, setIsMOuseOverCanvas] = useState<boolean>(false)
  const [viewportSize] = useState<Size>({ w: 500, h: 500 })
  const [canvasMouseCoords, setCanvasMouseCoords] = useState({ x: 0, y: 0 })
  const animation = useMemo(() => new AnimationEngine('HudCanvas'), [])
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>()


  const handleOnMouseOut = async (_: CanvasMouseEvent) => {
    setIsMOuseOverCanvas(false)
  }

  const handleCanvasMouseMove = async (e: CanvasMouseEvent) => {
    const { x, y } = getCanvasClickMouseCoords(e, ImageEditor.image.zoom)
    setCanvasMouseCoords({ x, y })
    setIsMOuseOverCanvas(true)
    ImageEditor.tools.activeTool.onMouseMove(e)

    ImageEditor.mouse.setMouseCoords({ x, y })
    ImageEditor.mouse.setIsFirstActionTick(false)
  }

  const handleCanvasClick = async (e: CanvasMouseEvent) => {
    ImageEditor.mouse.setMouseDown()
    ImageEditor.tools.activeTool.onMouseDown(e)
  }

  const handleZoomGesture = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!canvasContext) return
    const zoomAmount = event.deltaY > 0 ? -0.2 : 0.2
    const newZoom = ImageEditor.image.zoom + zoomAmount
    const coords = getCanvasImageCoords(
      {
        x: event.clientX,
        y: event.clientY
      },
      canvasContext.canvas,
      newZoom,
      ImageEditor.image.viewBox.position
    )

    ImageEditor.image.setZoom(newZoom, coords)
  }

  const handleScrollGesture = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!canvasContext) return
    ImageEditor.image.setViewBoxPosition({
      x: ImageEditor.image.viewBox.position.x + (event.deltaX / ImageEditor.image.zoom),
      y: ImageEditor.image.viewBox.position.y + (event.deltaY / ImageEditor.image.zoom)
    })
  }

  const handleWheelGesture = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (event.ctrlKey) handleZoomGesture(event)
    else handleScrollGesture(event)
  }

  const setContext = (context: CanvasRenderingContext2D | null) => {
    if (!context) return
    setCanvasContext(context)
  }

  const clearCanvas = () => {
    if (!canvasContext) return
    canvasContext.clearRect(
      0,
      0,
      viewportSize.w * ImageEditor.image.zoom,
      viewportSize.h * ImageEditor.image.zoom
    )
  }

  const renderImageBorder = () => {
    if (!canvasContext) return
    canvasContext.beginPath()
    canvasContext.strokeStyle = 'blue'
    canvasContext.lineWidth = 1
    canvasContext.strokeRect(
      Math.floor((ImageEditor.image.viewBox.position.x - 1) * -1 * ImageEditor.image.zoom),
      Math.floor((ImageEditor.image.viewBox.position.y - 1) * -1 * ImageEditor.image.zoom),
      ImageEditor.image.size.w * ImageEditor.image.zoom,
      ImageEditor.image.size.h * ImageEditor.image.zoom
    )
    canvasContext.closePath()
  }

  const renderCursor = () => {
    if (!canvasContext || !isMOuseOverCanvas) return
    const cursorSize = Math.trunc(ImageEditor.image.zoom)
    canvasContext.strokeStyle = 'red'
    canvasContext.beginPath()
    canvasContext.strokeRect(
      Math.trunc(canvasMouseCoords.x * ImageEditor.image.zoom),
      Math.trunc(canvasMouseCoords.y * ImageEditor.image.zoom),
      cursorSize,
      cursorSize
    )
    canvasContext.closePath()
  }

  const render = useEvent(() => {
    clearCanvas()
    renderImageBorder()
    renderCursor()
    animation.requestFrame(render)
  })


  useEffect(() => {
    window.addEventListener('mouseup', ImageEditor.mouse.setMouseUp)
    ImageEditor.eventBus.subscribe([
      ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE,
      ImageEditor.eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
      ImageEditor.eventBus.Event.HISTORY_CHANGE,
    ], render)
    return () => {
      animation.stop()
      ImageEditor.eventBus.unsubscribe([
        ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE,
        ImageEditor.eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
        ImageEditor.eventBus.Event.HISTORY_CHANGE,
      ], render)
      window.removeEventListener('mouseup', ImageEditor.mouse.setMouseUp)
    }
  }, [])

  return (
    <>
      <PersistentPixelatedCanvas
        className={styles.hudCanvas}
        contextRef={setContext}
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleCanvasClick}
        onMouseOut={handleOnMouseOut}
        onWheel={handleWheelGesture}
        width={viewportSize.w}
        height={viewportSize.h}
      />
    </>
  )
}

