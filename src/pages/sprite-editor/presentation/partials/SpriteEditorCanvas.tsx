import type { FC, MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useSpriteEditorContext } from '../../context'
import { SpriteCanvas, SpriteCanvasContainer, SpriteCanvasUI } from './SpriteEditorCanvas.styles'
import { SpriteEditorTool } from '../../types'
import { useSpriteEditorCanvasKeyBindings } from './SpriteEditorCanvas.keyBindings'

type CanvasMouseEvent = MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
type Coordinate = { x: number, y: number }

function getLinePoint(start: Coordinate, end: Coordinate) {
  const xDistance = end.x - start.x
  const yDistance = end.y - start.y
  const hypotenuseLength = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
  const data: Coordinate[] = []
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

const useSpriteEditorCanvas = () => {

}

export const SpriteEditorCanvas: FC = () => {
  const {
    editorHistory,
    paintPixel,
    undoLastChanges,
    redoLastChanges,
    registerChanges,
    spriteWidth,
    spriteHeight,
    spriteImageData,
    activeEditorTool
  } = useSpriteEditorContext()

  useSpriteEditorCanvasKeyBindings({
    undo: undoLastChanges,
    redo: redoLastChanges
  })


  const [canvasMouseCoords, setCanvasMouseCoords] = useState({ x: 0, y: 0 })
  const [canvasZoom, setCanvasZoom] = useState(10)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [lastMouseCoords, setLastMouseCords] = useState<Coordinate>({ x: 0, y: 0 })
  const [isFirstActionTick, setIsFirstActionTick] = useState(true)

  const canvasSpriteRef = useRef<HTMLCanvasElement>(null)
  const canvasUIRef = useRef<HTMLCanvasElement>(null)


  const getEventRelativeMouseCoords = (e: CanvasMouseEvent) => {
    if (!e.target) throw new Error('Target not found')
    const targetElement = e.target as HTMLElement
    const rect = targetElement.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / canvasZoom)
    const y = Math.floor((e.clientY - rect.top) / canvasZoom)
    return { x, y }
  }

  const getSpriteCanvasContext = () => {
    const canvas = canvasSpriteRef.current
    if (!canvas) throw new Error('Canvas not found')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Context not found')
    return context
  }

  const getUICanvasContext = () => {
    const canvas = canvasUIRef.current
    if (!canvas) throw new Error('Canvas not found')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Context not found')
    return context
  }


  const onCanvasMouseMove = async (e: CanvasMouseEvent) => {
    const { x, y } = getEventRelativeMouseCoords(e)
    setCanvasMouseCoords({ x, y })
    renderCursor(x, y)
    if (!isMouseDown) return

    switch (activeEditorTool) {
      case SpriteEditorTool.BRUSH: {
        // fill gaps in case movement is too fast
        const hasGaps = Math.abs(lastMouseCoords.x - x) > 1 || Math.abs(lastMouseCoords.y - y) > 1
        if (!isFirstActionTick && hasGaps) {
          const points = getLinePoint(lastMouseCoords, { x, y })
          for (const point of points) await draw(point.x, point.y)
        }
        // render the pixel
        await draw(x, y)
        break
      }
      case SpriteEditorTool.ERASER: {
        // fill gaps in case movement is too fast
        const hasGaps = Math.abs(lastMouseCoords.x - x) > 1 || Math.abs(lastMouseCoords.y - y) > 1
        if (!isFirstActionTick && hasGaps) {
          const points = getLinePoint(lastMouseCoords, { x, y })
          for (const point of points) await erase(point.x, point.y)
        }
        // erase the pixel
        await erase(x, y)
        break
      }
    }

    setLastMouseCords({ x, y })
    setIsFirstActionTick(false)
  }

  const onCanvasClick = async (e: CanvasMouseEvent) => {
    const { x, y } = getEventRelativeMouseCoords(e)
    switch (activeEditorTool) {
      case SpriteEditorTool.BRUSH:
        await draw(x, y)
        break
      case SpriteEditorTool.ERASER:
        await erase(x, y)
        break
    }
  }

  const renderCursor = (x: number, y: number) => {
    const context = getUICanvasContext()
    context.strokeStyle = 'red'
    context.clearRect(0, 0, spriteWidth, spriteHeight)
    context.beginPath()
    context.strokeRect(x * canvasZoom, y * canvasZoom, 1 * canvasZoom, 1 * canvasZoom)
    context.stroke()
    context.closePath()
  }

  const draw = async (x: number, y: number) => {
    await paintPixel(x, y, { r: 255, g: 255, b: 255, a: 255 })
    await redrawCanvas()
    registerChanges('Draw')
  }

  const erase = async (x: number, y: number) => {
    await paintPixel(x, y, { r: 0, g: 0, b: 0, a: 0 })
    await redrawCanvas()
    registerChanges('Erase')
  }

  const redrawCanvas = async () => {
    const context = getSpriteCanvasContext()
    const imageData = new ImageData(spriteImageData, spriteWidth, spriteHeight)
    const bitmap = await createImageBitmap(imageData)
    context.clearRect(0, 0, spriteWidth, spriteHeight)
    context.drawImage(bitmap, 0, 0)
  }

  useEffect(() => {
    redrawCanvas().catch(throwError)
  }, [editorHistory.currentIndex])

  useEffect(() => {
    const setMouseDown = () => {
      setIsMouseDown(true)
      setIsFirstActionTick(true)
    }
    const setMouseUp = () => {
      setIsMouseDown(false)
      setIsFirstActionTick(false)
      // setLastMouseCords(null)
    }
    window.addEventListener('mousedown', setMouseDown)
    window.addEventListener('mouseup', setMouseUp)
    const context = getSpriteCanvasContext()
    context.imageSmoothingEnabled = false
    context.resetTransform()
    context.scale(canvasZoom, canvasZoom)
    const uiContext = getUICanvasContext()
    uiContext.imageSmoothingEnabled = false
    return () => {
      window.removeEventListener('mousedown', setMouseDown)
      window.removeEventListener('mouseup', setMouseUp)
    }
  }, [])

  return (
    <>
      <div>
        <SpriteCanvasContainer>
          <SpriteCanvas ref={canvasSpriteRef} width={spriteWidth} height={spriteHeight} />
          <SpriteCanvasUI
            ref={canvasUIRef}
            onMouseMove={onCanvasMouseMove}
            onClick={onCanvasClick}
            width={spriteWidth}
            height={spriteHeight}
          />
        </SpriteCanvasContainer>
        <div>{activeEditorTool} / {canvasMouseCoords.x}-{canvasMouseCoords.y}</div>
      </div>
    </>
  )
}

