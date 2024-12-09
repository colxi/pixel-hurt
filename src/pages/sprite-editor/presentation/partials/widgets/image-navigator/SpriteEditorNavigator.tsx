import { useEffect, useMemo, useState, type FC } from 'react'
import { WidgetBox } from '../../../../../../tools/ui-components/widget-box/WidgetBox'
import { CanvasMouseEvent, getCanvasClickMouseCoords } from '../../../utils'
import styles from './SpriteEditorNavigator.module.css'
import { useEvent, useForceUpdate } from '../../../../../../tools/hooks'
import { PersistentPixelatedCanvas } from '../../../../../../tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { Coordinates, Size } from '../../../../types'
import { AnimationEngine } from '../../../../../../tools/utils/animation-engine'
import { minMax } from '../../../../../../tools/utils/math'
import { ImageEditor } from '@/pages/sprite-editor/controller'

const ZOOM_STEP = 0.20
const NAVIGATOR_CANVAS_SIZE: Size = {
  w: 198,
  h: 198
}

export const SpriteEditorNavigator: FC = () => {
  const { forceUpdate } = useForceUpdate()
  const animation = useMemo(() => new AnimationEngine('ImageNavigator'), [])
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

  const navigatorCanvasZoom = NAVIGATOR_CANVAS_SIZE.w / ImageEditor.image.size.w

  const updateViewBoxCoordinates = (clickCoords: Coordinates) => {
    const x = Math.floor(minMax({
      value: clickCoords.x,
      min: 0,
      max: ImageEditor.image.size.w - ImageEditor.image.viewBox.size.w
    }))
    const y = Math.floor(minMax({
      value: clickCoords.y,
      min: 0,
      max: ImageEditor.image.size.h - ImageEditor.image.viewBox.size.h
    }))
    ImageEditor.image.setViewBoxPosition({ x, y })
  }

  const renderTick = useEvent(() => {
    renderCanvas()
    animation.requestFrame(renderTick)
  })

  const renderCanvas = async () => {
    if (!canvasContext) return
    const imageData = new ImageData(ImageEditor.image.imageBuffer, ImageEditor.image.size.w, ImageEditor.image.size.h)
    const bitmap = await createImageBitmap(imageData)
    canvasContext.clearRect(0, 0, ImageEditor.image.size.w, ImageEditor.image.size.h)
    canvasContext.drawImage(bitmap, 0, 0)

    canvasContext.beginPath()
    canvasContext.strokeStyle = 'red'
    canvasContext.fillStyle = 'red'
    canvasContext.lineWidth = 1
    canvasContext.strokeRect(
      ImageEditor.image.viewBox.position.x,
      ImageEditor.image.viewBox.position.y,
      ImageEditor.image.viewBox.size.w,
      ImageEditor.image.viewBox.size.h
    )
    canvasContext.fillRect(
      ImageEditor.image.viewBox.position.x + (ImageEditor.image.viewBox.size.w / 2) - 5,
      ImageEditor.image.viewBox.position.y + (ImageEditor.image.viewBox.size.h / 2) - 5,
      10,
      10
    )
    canvasContext.closePath()
  }


  const handleMouseMove = (e: CanvasMouseEvent) => {
    if (!isMouseDown) return
    const clickCoords = getCanvasClickMouseCoords(e, navigatorCanvasZoom)
    const effectiveCords = {
      x: clickCoords.x - (ImageEditor.image.viewBox.size.w / 2),
      y: clickCoords.y - (ImageEditor.image.viewBox.size.h / 2)
    }
    updateViewBoxCoordinates(effectiveCords)
  }

  const handleOnClick = (e: CanvasMouseEvent) => {
    const clickCoords = getCanvasClickMouseCoords(e, navigatorCanvasZoom)
    const effectiveCords = {
      x: clickCoords.x - (ImageEditor.image.viewBox.size.w / 2),
      y: clickCoords.y - (ImageEditor.image.viewBox.size.h / 2)
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
    ImageEditor.image.setZoom(newZoom)
  }

  const handleZoomIncrement = () => {
    ImageEditor.image.setZoom(ImageEditor.image.zoom + ZOOM_STEP)
  }

  const handleDecrementZoom = () => {
    ImageEditor.image.setZoom(ImageEditor.image.zoom - ZOOM_STEP)
  }

  useEffect(() => {
    if (!canvasContext) return
    canvasContext.resetTransform()
    canvasContext.scale(navigatorCanvasZoom, navigatorCanvasZoom)
    renderTick()
  }, [canvasContext])


  useEffect(() => {
    ImageEditor.eventBus.subscribe(ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE, forceUpdate)
    window.addEventListener('mouseup', setMouseUp)
    return () => {
      ImageEditor.eventBus.unsubscribe(ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE, forceUpdate)
      window.removeEventListener('mouseup', setMouseUp)
      animation.stop()
    }
  }, [])

  return <>
    <WidgetBox title={`Navigator (${ImageEditor.image.zoom})`}>
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
          value={ImageEditor.image.zoom}
        />
        <button onClick={handleZoomIncrement}>+</button>
      </div>
      w:{ImageEditor.image.viewBox.size.w}/ h:{ImageEditor.image.viewBox.size.w}
    </WidgetBox >
  </>
}

