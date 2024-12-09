import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styles from './ImageCanvas.module.scss'
import { Size } from '../../../../types'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { AnimationEngine } from '@/tools/utils/animation-engine'
import { useEvent } from '@/tools/hooks'
import { ImageEditor } from '@/pages/sprite-editor/controller'

export const ImageCanvas: FC = () => {
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
      // viewportSize.w / image.zoom,
      // viewportSize.h / image.zoom
    )
    // imageCanvasContext.fill()

    // clear the part of the canvas that has data in the buffer.
    // Coordinates that are before or after the actual viewport are not cleared
    imageCanvasContext.clearRect(
      ImageEditor.image.viewBox.position.x > 0 ? 0 : Math.abs(ImageEditor.image.viewBox.position.x),
      ImageEditor.image.viewBox.position.y > 0 ? 0 : Math.abs(ImageEditor.image.viewBox.position.y),
      ImageEditor.image.viewBox.size.w + ImageEditor.image.viewBox.position.x > viewportSize.w
        ? viewportSize.w - (ImageEditor.image.viewBox.position.x + ImageEditor.image.viewBox.size.w - viewportSize.w)
        : viewportSize.w,
      ImageEditor.image.viewBox.size.h + ImageEditor.image.viewBox.position.y > viewportSize.h
        ? viewportSize.h - (ImageEditor.image.viewBox.position.y + ImageEditor.image.viewBox.size.h - viewportSize.h)
        : viewportSize.h,
    )

    // old
    // imageCanvasContext.clearRect(
    //   image.viewBox.position.x > 0 ? 0 : Math.abs(image.viewBox.position.x),
    //   image.viewBox.position.y > 0 ? 0 : Math.abs(image.viewBox.position.y),
    //   image.viewBox.size.w + image.viewBox.position.x > viewportSize.w
    //     ? (viewportSize.w / image.zoom) - (image.viewBox.position.x + image.viewBox.size.w - viewportSize.w)
    //     : viewportSize.w / image.zoom,
    //   image.viewBox.size.h + image.viewBox.position.y > viewportSize.h
    //     ? (viewportSize.h / image.zoom) - (image.viewBox.position.y + image.viewBox.size.h - viewportSize.h)
    //     : viewportSize.h / image.zoom,
    // )


    // copy the image fom the buffer to the canvas
    const imageData = new ImageData(
      ImageEditor.image.imageBuffer,
      ImageEditor.image.size.w,
      ImageEditor.image.size.h
    )
    const bitmap = await createImageBitmap(
      imageData,
      ImageEditor.image.viewBox.position.x,
      ImageEditor.image.viewBox.position.y,
      ImageEditor.image.size.w,
      ImageEditor.image.size.h,
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
    imageCanvasContext.scale(ImageEditor.image.zoom, ImageEditor.image.zoom)
  })

  const updateCanvas = useEvent(() => {
    if (!imageCanvasContext) return
    setCanvasZoom()
    animationTick()
  })

  useEffect(updateCanvas, [imageCanvasContext])

  useEffect(() => {
    ImageEditor.history.register('Create')
    ImageEditor.eventBus.subscribe([
      ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE,
      ImageEditor.eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
      ImageEditor.eventBus.Event.HISTORY_CHANGE,
    ], updateCanvas)

    return () => {
      ImageEditor.eventBus.unsubscribe([
        ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE,
        ImageEditor.eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
        ImageEditor.eventBus.Event.HISTORY_CHANGE,
      ], updateCanvas)
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

