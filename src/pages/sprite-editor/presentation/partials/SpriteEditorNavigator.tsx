import { useEffect, useRef, useState, type FC } from 'react'
import styled from 'styled-components'
import { WidgetBox } from '../../../../tools/ui-components/widget-box/WidgetBox'
import { useSpriteEditorContext } from '../../context'
import { Coordinates, Size } from '../../types'
import { CanvasMouseEvent, getCanvasClickMouseCoords } from '../utils'

const MiniMapCanvas = styled.canvas`
  width: 100%;
`

export const SpriteEditorNavigator: FC = () => {
  const {
    editorImage,
  } = useSpriteEditorContext()

  const canvasUIRef = useRef<HTMLCanvasElement>(null)
  const [requestAnimationFrameId, setRequestAnimationFrameId] = useState<number>(0)
  const [viewZoom, setViewZoom] = useState(10)
  const [canvasWidth, setcanvasWidth] = useState(198)
  const [canvasHeight, setcanvasHeight] = useState(198)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [editorViewportSize, setEditorViewportSize] = useState<Size>({ width: 500, height: 500 })


  const getNavigatorCanvas = () => {
    const canvas = canvasUIRef.current
    if (!canvas) throw new Error('Canvas not found')
    return canvas
  }

  const getNavigatorCanvasContext = () => {
    const canvas = getNavigatorCanvas()
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Context not found')
    return context
  }

  const redrawCanvas = async () => {
    const context = getNavigatorCanvasContext()
    const imageData = new ImageData(editorImage.imageBuffer, editorImage.width, editorImage.height)
    const bitmap = await createImageBitmap(imageData)
    context.clearRect(0, 0, editorImage.width, editorImage.height)
    context.drawImage(bitmap, 0, 0)

    context.beginPath()
    context.strokeStyle = 'red'
    context.lineWidth = 1
    context.strokeRect(
      editorImage.viewBoxCoords.x,
      editorImage.viewBoxCoords.y,
      editorViewportSize.width / viewZoom,
      editorViewportSize.height / viewZoom
    )
    context.fill()
    context.stroke()
    const id = requestAnimationFrame(redrawCanvas)
    setRequestAnimationFrameId(id)
  }

  const setViewBoxCoordinates = (e: CanvasMouseEvent) => {
    const clickCoords = getCanvasClickMouseCoords(e)
    const canvasBox = getNavigatorCanvas().getBoundingClientRect()

    const boxWidth = Math.floor(editorViewportSize.width / viewZoom)
    const boxHeight = Math.floor(editorViewportSize.height / viewZoom)
    const x = Math.floor(Math.min(Math.max(clickCoords.x - boxWidth / 2, 0), canvasWidth - boxWidth))
    const y = Math.floor(Math.min(Math.max(clickCoords.y - boxHeight / 2, 0), canvasHeight - boxHeight))
    // const effectiveCoords = {
    //   x: Math.floor(clickCoords.x * spriteWidth / canvasBox.width),
    //   y: Math.floor(clickCoords.y * spriteHeight / canvasBox.height)
    // }
    editorImage.setViewBoxCoords({ x, y })
  }

  const onMouseMove = (e: CanvasMouseEvent) => {
    if (isMouseDown) setViewBoxCoordinates(e)
  }

  const setMouseUp = () => {
    setIsMouseDown(false)
  }

  const setMouseDown = () => {
    setIsMouseDown(true)
  }

  useEffect(() => {
    cancelAnimationFrame(requestAnimationFrameId)
    const id = requestAnimationFrame(redrawCanvas)
    setRequestAnimationFrameId(id)
  }, [editorImage.viewBoxCoords])

  useEffect(() => {
    window.addEventListener('mouseup', setMouseUp)
    return () => {
      window.removeEventListener('mouseup', setMouseUp)
      cancelAnimationFrame(requestAnimationFrameId)
    }
  }, [])

  return <>
    <WidgetBox title="Navigator">
      <MiniMapCanvas
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasUIRef}
        onMouseDown={setMouseDown}
        onMouseMove={onMouseMove}
        onClick={setViewBoxCoordinates}
      />
    </WidgetBox >
  </>
}

