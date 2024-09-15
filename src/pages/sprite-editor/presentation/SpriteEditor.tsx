import { SpriteEditorContextProvider } from '../context'
import { SpriteEditorCanvas } from './partials/SpriteEditorCanvas'
import { SpriteEditorTools } from './partials/widgets/SpriteEditorTools'
import { SpriteEditorPalette } from './partials/widgets/SpriteEditorPalette'
import { SpriteEditorHistory } from './partials/widgets/SpriteEditorHistory'
import { SpriteEditorNavigator } from './partials/widgets/navigator/SpriteEditorNavigator'
import { SpriteEditorInfo } from './partials/widgets/SpriteEditorInfo'
import styles from './SpriteEditor.module.scss'
import { ImageEditorCanvas } from './partials/image-editor-canvas/ImageEditorCanvas'

export const SpriteEditor = () => {
  return (
    <>
      <SpriteEditorContextProvider >
        <main className={styles.layout}>
          <SpriteEditorTools />
          <ImageEditorCanvas />
          {/* <SpriteEditorCanvas /> */}
          <aside className={styles.sidebar}>
            <SpriteEditorInfo />
            <SpriteEditorNavigator />
            <SpriteEditorPalette />
            <SpriteEditorHistory />
          </aside>
        </main>
      </SpriteEditorContextProvider >
    </>
  )
}

