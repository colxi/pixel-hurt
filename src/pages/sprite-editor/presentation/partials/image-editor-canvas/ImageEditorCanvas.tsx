import { useEffect, useRef, type FC } from 'react'
import styles from './ImageEditorCanvas.module.scss'
import { HudCanvas } from './partials/HudCanvas'
import { ImageCanvas } from './partials/ImageCanvas'

export const ImageEditorCanvas: FC = () => {
  // const viewportRef = useRef<HTMLElement>(null)

  // const onViewportSizeChange = (entries: ResizeObserverEntry[]) => {
  //   const viewportElement = entries[0]
  //   console.log(viewportElement.contentRect.width)
  // }

  // useEffect(() => {
  //   if (!viewportRef.current) return
  //   const observer = new ResizeObserver(onViewportSizeChange)
  //   observer.observe(viewportRef.current)
  //   return () => observer.disconnect()
  // }, [viewportRef])


  return (
    <>
      <main className={styles.viewport} >
        <section className={styles.container} >
          <ImageCanvas />
          <HudCanvas />
        </section>
      </main>
    </>
  )
}

