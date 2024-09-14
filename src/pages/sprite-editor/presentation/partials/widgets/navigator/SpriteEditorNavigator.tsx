import { useEffect, useMemo, useRef, useState, type FC } from 'react'
import { WidgetBox } from '../../../../../../tools/ui-components/widget-box/WidgetBox'
import { useSpriteEditorContext } from '../../../../context'
import { CanvasMouseEvent, getCanvasClickMouseCoords } from '../../../utils'
import styles from './SpriteEditorNavigator.module.css'
import { useEvent } from '../../../../../../tools/hooks'
import { PersistentCanvas } from '../../../../../../tools/ui-components/persistent-canvas/PersistentCanvas'
import { Coordinates, Size } from '../../../../types'
import { AnimationEngine } from '../../../../../../tools/utils/animation-engine'
import { minMax } from '../../../../../../tools/utils/math'

const NAVIGATOR_CANVAS_SIZE: Size = {
  w: 198,
  h: 198
}


export const SpriteEditorNavigator: FC = () => {
  const { editorImage } = useSpriteEditorContext()

  const animation = useMemo(() => new AnimationEngine('ImageNavigator'), [])
  const [navigatorCanvasContext, setNavigatorCanvasContext] = useState<CanvasRenderingContext2D | null>(null)
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
    redrawCanvas()
    animation.requestFrame(renderTick)
  })

  const redrawCanvas = async () => {
    if (!navigatorCanvasContext) return
    const imageData = new ImageData(editorImage.imageBuffer, editorImage.width, editorImage.height)
    const bitmap = await createImageBitmap(imageData)
    navigatorCanvasContext.clearRect(0, 0, editorImage.width, editorImage.height)
    navigatorCanvasContext.drawImage(bitmap, 0, 0)

    navigatorCanvasContext.beginPath()
    navigatorCanvasContext.strokeStyle = 'red'
    navigatorCanvasContext.lineWidth = 1
    navigatorCanvasContext.strokeRect(
      editorImage.viewBox.position.x,
      editorImage.viewBox.position.y,
      editorImage.viewBox.size.w,
      editorImage.viewBox.size.h
    )
    navigatorCanvasContext.fill()
    navigatorCanvasContext.stroke()
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

    const newViewBoxSize = {
      w: Math.floor(editorImage.width / newZoom),
      h: Math.floor(editorImage.height / newZoom),
    }
    const widthDiff = editorImage.viewBox.size.w - newViewBoxSize.w
    const heightDiff = editorImage.viewBox.size.h - newViewBoxSize.h
    updateViewBoxCoordinates(
      {
        x: editorImage.viewBox.position.x + Math.floor(widthDiff / 2),
        y: editorImage.viewBox.position.y + Math.floor(heightDiff / 2),
      }
    )
  }

  useEffect(() => {
    if (!navigatorCanvasContext) return
    navigatorCanvasContext.resetTransform()
    navigatorCanvasContext.scale(navigatorCanvasZoom, navigatorCanvasZoom)
    renderTick()
  }, [navigatorCanvasContext])

  useEffect(() => {
    window.addEventListener('mouseup', setMouseUp)
    return () => {
      window.removeEventListener('mouseup', setMouseUp)
      animation.stop()
    }
  }, [])

  return <>
    <WidgetBox title={`Navigator (${editorImage.zoom})`}>
      <PersistentCanvas
        width={NAVIGATOR_CANVAS_SIZE.w}
        height={NAVIGATOR_CANVAS_SIZE.h}
        contextRef={setNavigatorCanvasContext}
        onMouseDown={setMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleOnClick}
      />
      <input
        type="range"
        onChange={handleZoomChange}
        min={1}
        max={30}
        step={.20}
        value={editorImage.zoom}
        className={styles.slider}
      />
      w:{editorImage.viewBox.size.w}/ h:{editorImage.viewBox.size.w}
    </WidgetBox >
  </>
}

