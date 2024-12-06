import { useEffect, useMemo, useRef, useState, type FC } from 'react'
import { WidgetBox } from '../../../../../../tools/ui-components/widget-box/WidgetBox'
import { useSpriteEditorContext } from '../../../../context'
import { CanvasMouseEvent, getCanvasClickMouseCoords } from '../../../utils'
import styles from './SpriteEditorNavigator.module.css'
import { useEvent } from '../../../../../../tools/hooks'
import { PersistentPixelatedCanvas } from '../../../../../../tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { Coordinates, Size } from '../../../../types'
import { AnimationEngine } from '../../../../../../tools/utils/animation-engine'
import { minMax } from '../../../../../../tools/utils/math'

const ZOOM_STEP = 0.20
const NAVIGATOR_CANVAS_SIZE: Size = {
  w: 198,
  h: 198
}



export const SpriteEditorNavigator: FC = () => {
  const { editorImage } = useSpriteEditorContext()

  const animation = useMemo(() => new AnimationEngine('ImageNavigator'), [])
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
  const navigatorCanvasZoom = useMemo<number>(() =>
    NAVIGATOR_CANVAS_SIZE.w / editorImage.width,
    [editorImage.width]
  )



  const updateViewBoxCoordinates = (clickCoords: Coordinates) => {
    const x = Math.floor(minMax({
      value: clickCoords.x,
      min: 0,
      max: editorImage.width - editorImage.viewBox.size.w
    }))
    const y = Math.floor(minMax({
      value: clickCoords.y,
      min: 0,
      max: editorImage.height - editorImage.viewBox.size.h
    }))
    editorImage.setViewBoxPosition({ x, y })
  }

  useEffect(() => {
    updateViewBoxCoordinates({
      x: editorImage.viewBox.position.x,
      y: editorImage.viewBox.position.y
    })
  }, [editorImage.viewBox.size])

  const renderTick = useEvent(() => {
    renderCanvas()
    animation.requestFrame(renderTick)
  })

  const renderCanvas = async () => {
    if (!canvasContext) return
    const imageData = new ImageData(editorImage.imageBuffer, editorImage.width, editorImage.height)
    const bitmap = await createImageBitmap(imageData)
    canvasContext.clearRect(0, 0, editorImage.width, editorImage.height)
    canvasContext.drawImage(bitmap, 0, 0)

    canvasContext.beginPath()
    canvasContext.strokeStyle = 'red'
    canvasContext.fillStyle = 'red'
    canvasContext.lineWidth = 1
    canvasContext.strokeRect(
      editorImage.viewBox.position.x,
      editorImage.viewBox.position.y,
      editorImage.viewBox.size.w,
      editorImage.viewBox.size.h
    )
    canvasContext.fillRect(
      editorImage.viewBox.position.x + (editorImage.viewBox.size.w / 2) - 5,
      editorImage.viewBox.position.y + (editorImage.viewBox.size.h / 2) - 5,
      10,
      10
    )
    canvasContext.closePath()

  }


  const handleMouseMove = (e: CanvasMouseEvent) => {
    if (!isMouseDown) return
    const clickCoords = getCanvasClickMouseCoords(e, navigatorCanvasZoom)
    const effectiveCords = {
      x: clickCoords.x - (editorImage.viewBox.size.w / 2),
      y: clickCoords.y - (editorImage.viewBox.size.h / 2)
    }
    updateViewBoxCoordinates(effectiveCords)
  }

  const handleOnClick = (e: CanvasMouseEvent) => {
    const clickCoords = getCanvasClickMouseCoords(e, navigatorCanvasZoom)
    const effectiveCords = {
      x: clickCoords.x - (editorImage.viewBox.size.w / 2),
      y: clickCoords.y - (editorImage.viewBox.size.h / 2)
    }
    updateViewBoxCoordinates(effectiveCords)
  }

  const setMouseUp = () => {
    setIsMouseDown(false)
  }

  const setMouseDown = () => {
    setIsMouseDown(true)
  }

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = Number(e.target.value)
    editorImage.setZoom(newZoom)
  }

  const handleZoomIncrement = () => {
    editorImage.setZoom(editorImage.zoom + ZOOM_STEP)
  }

  const handleDecrementZoom = () => {
    editorImage.setZoom(editorImage.zoom - ZOOM_STEP)
  }

  useEffect(() => {
    if (!canvasContext) return
    canvasContext.resetTransform()
    canvasContext.scale(navigatorCanvasZoom, navigatorCanvasZoom)
    renderTick()
  }, [canvasContext])

  useEffect(() => {
    window.addEventListener('mouseup', setMouseUp)
    return () => {
      window.removeEventListener('mouseup', setMouseUp)
      animation.stop()
    }
  }, [])

  return <>
    <WidgetBox title={`Navigator (${editorImage.zoom})`}>
      <PersistentPixelatedCanvas
        width={NAVIGATOR_CANVAS_SIZE.w}
        height={NAVIGATOR_CANVAS_SIZE.h}
        contextRef={setCanvasContext}
        onMouseDown={setMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleOnClick}
      />
      <div className={styles.controls}>
        <button onClick={handleDecrementZoom}>-</button>
        <input
          type="range"
          onChange={handleZoomChange}
          min={1}
          max={30}
          step={ZOOM_STEP}
          value={editorImage.zoom}
        />
        <button onClick={handleZoomIncrement}>+</button>
      </div>
      w:{editorImage.viewBox.size.w}/ h:{editorImage.viewBox.size.w}
    </WidgetBox >
  </>
}

