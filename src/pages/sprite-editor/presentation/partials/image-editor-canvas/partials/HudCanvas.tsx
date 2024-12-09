import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styles from './HudCanvas.module.scss'
import { useSpriteEditorCanvasKeyBindings } from '../.././SpriteEditorCanvas.keyBindings'
import { CanvasMouseEvent, getCanvasClickMouseCoords, getCanvasImageCoords } from '../../../utils'
import { AnimationEngine } from '../../../../../../tools/utils/animation-engine'
import { Size } from '../../../../types'
import { useEvent } from '@/tools/hooks'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { ImageEditor } from '@/pages/sprite-editor/controller'

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

  const handleWheelGesture = useEvent((event: WheelEvent) => {
    if (!canvasContext) return
    const gestureType = event.ctrlKey ? 'zoom' : 'scroll'
    if (gestureType === 'zoom') {
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
  })

  const setContext = (context: CanvasRenderingContext2D | null) => {
    if (!context) return
    context.canvas.removeEventListener('wheel', handleWheelGesture)
    context.canvas.addEventListener('wheel', handleWheelGesture, { passive: false })
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
      canvasContext?.canvas.removeEventListener('wheel', handleWheelGesture)
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
        width={viewportSize.w}
        height={viewportSize.h}
      />
    </>
  )
}

