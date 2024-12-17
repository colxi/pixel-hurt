import { ImageEditor } from '@/pages/sprite-editor/controller'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { useState } from 'react'


export const ColorPicker = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  const onContextUpdate = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return
    setContext(ctx)
    createPalette(ctx)
  }

  const createPalette = (context: CanvasRenderingContext2D) => {
    const { width, height } = context.canvas
    var gradient = context.createLinearGradient(0, 0, width, 0)
    // Create color gradient
    gradient.addColorStop(0, 'rgb(255,0,0)')
    gradient.addColorStop(0.15, 'rgb(255,0,255)')
    gradient.addColorStop(0.33, 'rgb(0,0,255)')
    gradient.addColorStop(0.49, 'rgb(0,255,255)')
    gradient.addColorStop(0.67, 'rgb(0,255,0)')
    gradient.addColorStop(0.84, 'rgb(255,255,0)')
    gradient.addColorStop(1, 'rgb(255,0,0)')

    // Apply gradient to canvas
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)

    // Create semi transparent gradient (white -> trans. -> black)
    gradient = context.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)')
    gradient.addColorStop(0.5, 'rgba(0,0,0, 0)')
    gradient.addColorStop(1, 'rgba(0,0,0, 1)')

    // Apply gradient to canvas
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
  }

  const getColorFromClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.target as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (!context) throw new Error('Canvas context not found')

    const pixelData = context.getImageData(x, y, 1, 1).data
    return {
      r: pixelData[0],
      g: pixelData[1],
      b: pixelData[2],
      a: pixelData[3]
    }
  }

  const handleLeftClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getColorFromClick(event)
    ImageEditor.color.setPrimaryColor(color)
  }

  const handRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getColorFromClick(event)
    ImageEditor.color.setSecondaryColor(color)
  }

  return <>
    <PersistentPixelatedCanvas
      width={198}
      height={100}
      willReadFrequently={true}
      contextRef={onContextUpdate}
      onClick={handleLeftClick}
      onContextMenu={handRightClick}
    />
  </>
}
