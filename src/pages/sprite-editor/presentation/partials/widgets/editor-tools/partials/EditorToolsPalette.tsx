import { useEffect, type FC } from 'react'
import { ImageEditor } from '@/pages/sprite-editor/controller'
import { useForceUpdate } from '@/tools/hooks'
import { SpriteEditorTool } from '@/pages/sprite-editor/controller/editor-tools/types'
import {
  CrossIcon,
  BrushIcon,
  EraserIcon,
  HandIcon,
  MagnifyingGlassIcon,
  EyeDropperIcon,
  FillDripIcon,
} from '@/tools/ui-components/icons'
import styles from './EditorToolsPalette.module.scss'

export const EditorToolsPalette: FC = () => {
  const { forceUpdate } = useForceUpdate()

  const handleToolChange = (tool: SpriteEditorTool) => {
    ImageEditor.tools.setActiveToolName(tool)
  }

  useEffect(() => {
    ImageEditor.eventBus.subscribe([
      ImageEditor.eventBus.Event.TOOL_CHANGE,
      ImageEditor.eventBus.Event.PRIMARY_COLOR_CHANGE,
      ImageEditor.eventBus.Event.SECONDARY_COLOR_CHANGE
    ], forceUpdate)
    return () => {
      ImageEditor.eventBus.unsubscribe([
        ImageEditor.eventBus.Event.TOOL_CHANGE,
        ImageEditor.eventBus.Event.PRIMARY_COLOR_CHANGE,
        ImageEditor.eventBus.Event.SECONDARY_COLOR_CHANGE
      ], forceUpdate)
    }
  })

  return (
    <section className={styles.toolsPalette}>
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.MOVE}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.MOVE)}
      >
        <CrossIcon />
      </div>
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.EYE_DROPPER}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.EYE_DROPPER)}
      >
        <EyeDropperIcon />
      </div>
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.BRUSH}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.BRUSH)}
      >
        <BrushIcon />
      </div>
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.PAINT_BUCKET}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.PAINT_BUCKET)}
      >
        <FillDripIcon />
      </div>
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.ERASER}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.ERASER)}
      >
        <EraserIcon />
      </div
      >
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.HAND}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.HAND)}
      >
        <HandIcon />
      </div>
      <div
        className={styles.toolsButton}
        data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.ZOOM}
        onClick={() => handleToolChange(ImageEditor.tools.Tool.ZOOM)}
      >
        <MagnifyingGlassIcon />
      </div>
    </section>
  )
}

