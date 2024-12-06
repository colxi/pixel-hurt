import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSpriteEditorContext } from '../../../../context'
import styles from './HudCanvas.module.scss'
import { useSpriteEditorCanvasKeyBindings } from '../.././SpriteEditorCanvas.keyBindings'
import { CanvasMouseEvent, getCanvasClickMouseCoords, getCanvasImageCoords } from '../../../utils'
import { AnimationEngine } from '../../../../../../tools/utils/animation-engine'
import { Size } from '../../../../types'
import { useEvent } from '@/tools/hooks'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'

export const HudCanvas: FC = () => {
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

  const [isMOuseOverCanvas, setIsMOuseOverCanvas] = useState<boolean>(false)
  const [viewportSize] = useState<Size>({ w: 500, h: 500 })
  const [canvasMouseCoords, setCanvasMouseCoords] = useState({ x: 0, y: 0 })
  const animation = useMemo(() => new AnimationEngine('HudCanvas'), [])
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>()


  const handleOnMouseOut = async (_: CanvasMouseEvent) => {
    setIsMOuseOverCanvas(false)
  }

  const handleCanvasMouseMove = async (e: CanvasMouseEvent) => {
    const { x, y } = getCanvasClickMouseCoords(e, editorImage.zoom)
    setCanvasMouseCoords({ x, y })
    setIsMOuseOverCanvas(true)
    editorTools.tool[editorTools.activeEditorTool].onMouseMove(e)

    canvasMouse.setLastMouseCoords({ x, y })
    canvasMouse.setIsFirstActionTick(false)
  }

  const handleCanvasClick = async (e: CanvasMouseEvent) => {
    canvasMouse.setMouseDown()
    editorTools.tool[editorTools.activeEditorTool].onMouseDown(e)
  }

  const handleWheelGesture = useEvent((event: WheelEvent) => {
    if (!canvasContext) return
    const gestureType = event.ctrlKey ? 'zoom' : 'scroll'
    if (gestureType === 'zoom') {
      const zoomAmount = event.deltaY > 0 ? -0.2 : 0.2
      const newZoom = editorImage.zoom + zoomAmount
      const coords = getCanvasImageCoords(
        {
          x: event.clientX,
          y: event.clientY
        },
        canvasContext.canvas,
        newZoom,
        editorImage.viewBox.position
      )

      console.log(coords)
      editorImage.setZoom(newZoom, coords)
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
      viewportSize.w * editorImage.zoom,
      viewportSize.h * editorImage.zoom
    )
  }

  const renderCursor = () => {
    if (!canvasContext || !isMOuseOverCanvas) return
    const cursorSize = Math.trunc(editorImage.zoom)
    canvasContext.strokeStyle = 'red'
    canvasContext.beginPath()
    canvasContext.strokeRect(
      Math.trunc(canvasMouseCoords.x * editorImage.zoom),
      Math.trunc(canvasMouseCoords.y * editorImage.zoom),
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

  useEffect(render, [
    editorImage.zoom,
    actionHistory.currentIndex,
    editorImage.viewBox.position
  ])

  useEffect(() => {
    window.addEventListener('mouseup', canvasMouse.setMouseUp)
    return () => {
      animation.stop()
      window.removeEventListener('mouseup', canvasMouse.setMouseUp)
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

