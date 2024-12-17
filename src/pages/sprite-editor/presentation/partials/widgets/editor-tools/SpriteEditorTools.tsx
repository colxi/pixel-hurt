import { type FC } from 'react'
import styles from './SpriteEditorTools.module.scss'
import { EditorToolsColor } from './partials/EditorToolsColor'
import { EditorToolsPalette } from './partials/EditorToolsPalette'

export const SpriteEditorTools: FC = () => {
  return (
    <main className={styles.toolsBar}>
      <section className={styles.toolsBarHeader}>
        &gt;&gt;
      </section>
      <EditorToolsPalette />
      <EditorToolsColor />
    </main>
  )
}

