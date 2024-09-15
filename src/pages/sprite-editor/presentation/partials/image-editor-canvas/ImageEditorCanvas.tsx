import type { FC } from 'react'
import styles from './ImageEditorCanvas.module.scss'
import { HudCanvas } from './partials/HudCanvas'
import { ImageCanvas } from './partials/ImageCanvas'

export const ImageEditorCanvas: FC = () => {
  return (
    <>
      <div>
        <main className={styles.container}>
          <ImageCanvas />
          <HudCanvas />
        </main>
        {/* <div>Mouse:{editorTools.activeEditorTool} / {canvasMouseCoords.x}-{canvasMouseCoords.y}</div> */}
      </div>
    </>
  )
}

