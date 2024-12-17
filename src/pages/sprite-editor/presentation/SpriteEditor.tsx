import { SpriteEditorTools } from './partials/widgets/editor-tools/SpriteEditorTools'
import { SpriteEditorPalette } from './partials/widgets/color-palette/SpriteEditorPalette'
import { SpriteEditorHistory } from './partials/widgets/editor-history/SpriteEditorHistory'
import { SpriteEditorNavigator } from './partials/widgets/image-navigator/SpriteEditorNavigator'
import { SpriteEditorInfo } from './partials/widgets/image-info/SpriteEditorInfo'
import styles from './SpriteEditor.module.scss'
import { ImageEditorCanvas } from './partials/image-editor-canvas/ImageEditorCanvas'

export const SpriteEditor = () => {
  return (
    <main className={styles.imageEditor} onContextMenu={e => e.preventDefault()}>
      <SpriteEditorTools />
      <ImageEditorCanvas />
      <aside className={styles.sidebar}>
        <SpriteEditorInfo />
        <SpriteEditorNavigator />
        <SpriteEditorPalette />
        <SpriteEditorHistory />
      </aside>
    </main>
  )
}

