import { useEffect, type FC } from 'react'
import { WidgetBox } from '@/tools/ui-components/widget-box/WidgetBox'
import {
  CrossIcon,
  BrushIcon,
  EraserIcon,
  HandIcon,
  MagnifyingGlassIcon
} from '@/tools/ui-components/icons'
import { ImageEditor } from '@/pages/sprite-editor/controller'
import styles from './SpriteEditorTools.module.scss'
import { useForceUpdate } from '@/tools/hooks'
import { SpriteEditorTool } from '@/pages/sprite-editor/types'

export const SpriteEditorTools: FC = () => {
  const { forceUpdate } = useForceUpdate()

  const handleToolChange = (tool: SpriteEditorTool) => {
    ImageEditor.tools.setActiveToolName(tool)
  }

  useEffect(() => {
    ImageEditor.eventBus.subscribe(ImageEditor.eventBus.Event.TOOL_CHANGE, forceUpdate)
    return () => {
      ImageEditor.eventBus.unsubscribe(ImageEditor.eventBus.Event.TOOL_CHANGE, forceUpdate)
    }
  })

  return (
    <>
      <WidgetBox>
        <div
          className={styles.toolsButton}
          data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.MOVE}
          onClick={() => handleToolChange(SpriteEditorTool.MOVE)}
        >
          <CrossIcon />
        </div>
        <div
          className={styles.toolsButton}
          data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.BRUSH}
          onClick={() => handleToolChange(SpriteEditorTool.BRUSH)}
        >
          <BrushIcon />
        </div>
        <div
          className={styles.toolsButton}
          data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.ERASER}
          onClick={() => handleToolChange(SpriteEditorTool.ERASER)}
        >
          <EraserIcon />
        </div
        >
        <div
          className={styles.toolsButton}
          data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.HAND}
          onClick={() => handleToolChange(SpriteEditorTool.HAND)}
        >
          <HandIcon />
        </div>
        <div
          className={styles.toolsButton}
          data-active={ImageEditor.tools.activeToolName === ImageEditor.tools.Tool.ZOOM}
          onClick={() => handleToolChange(SpriteEditorTool.ZOOM)}
        >
          <MagnifyingGlassIcon />
        </div>
      </WidgetBox>
    </>
  )
}

