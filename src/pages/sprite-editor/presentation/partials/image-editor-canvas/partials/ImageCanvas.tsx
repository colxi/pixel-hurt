import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSpriteEditorContext } from '../../../../context'
import styles from './ImageCanvas.module.scss'
import { Size } from '../../../../types'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { AnimationEngine } from '@/tools/utils/animation-engine'
import { useEvent } from '@/tools/hooks'

export const ImageCanvas: FC = () => {
  const {
    actionHistory,
    editorImage,
  } = useSpriteEditorContext()

  const [viewportSize] = useState<Size>({ w: 500, h: 500 })
  const [imageCanvasContext, setImageCanvasContext] = useState<CanvasRenderingContext2D | null>()
  const animation = useMemo(() => new AnimationEngine('ImageCanvas'), [])


  const renderCanvas = async () => {
    if (!imageCanvasContext) return

    // paint the background in pink to show the viewport
    imageCanvasContext.fillStyle = '#bf4f74'
    imageCanvasContext.fillRect(
      0,
      0,
      viewportSize.w,
      viewportSize.h
      // viewportSize.w / editorImage.zoom,
      // viewportSize.h / editorImage.zoom
    )
    // imageCanvasContext.fill()

    // clear the part of the canvas that has data in the buffer.
    // Coordinates that are before or after the actual viewport are not cleared
    imageCanvasContext.clearRect(
      editorImage.viewBox.position.x > 0 ? 0 : Math.abs(editorImage.viewBox.position.x),
      editorImage.viewBox.position.y > 0 ? 0 : Math.abs(editorImage.viewBox.position.y),
      editorImage.viewBox.size.w + editorImage.viewBox.position.x > viewportSize.w
        ? viewportSize.w - (editorImage.viewBox.position.x + editorImage.viewBox.size.w - viewportSize.w)
        : viewportSize.w,
      editorImage.viewBox.size.h + editorImage.viewBox.position.y > viewportSize.h
        ? viewportSize.h - (editorImage.viewBox.position.y + editorImage.viewBox.size.h - viewportSize.h)
        : viewportSize.h,
    )

    // old
    // imageCanvasContext.clearRect(
    //   editorImage.viewBox.position.x > 0 ? 0 : Math.abs(editorImage.viewBox.position.x),
    //   editorImage.viewBox.position.y > 0 ? 0 : Math.abs(editorImage.viewBox.position.y),
    //   editorImage.viewBox.size.w + editorImage.viewBox.position.x > viewportSize.w
    //     ? (viewportSize.w / editorImage.zoom) - (editorImage.viewBox.position.x + editorImage.viewBox.size.w - viewportSize.w)
    //     : viewportSize.w / editorImage.zoom,
    //   editorImage.viewBox.size.h + editorImage.viewBox.position.y > viewportSize.h
    //     ? (viewportSize.h / editorImage.zoom) - (editorImage.viewBox.position.y + editorImage.viewBox.size.h - viewportSize.h)
    //     : viewportSize.h / editorImage.zoom,
    // )


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

  useEffect(() => {
    actionHistory.register('Create')
    return () => {
      animation.stop()
    }
  }, [])

  return (
    <>
      <PersistentPixelatedCanvas
        className={styles.imageCanvas}
        contextRef={setImageCanvasContext}
        width={viewportSize.w}
        height={viewportSize.h}
      />
    </>
  )
}

