import { useEffect, type FC } from 'react'
import { WidgetBox } from '@/tools/ui-components/widget-box/WidgetBox'
import {
  CrossIcon,
  BrushIcon,
  EraserIcon,
  HandIcon,
  MagnifyingGlassIcon,
  EyeDropperIcon
} from '@/tools/ui-components/icons'
import { ImageEditor } from '@/pages/sprite-editor/controller'
import styles from './SpriteEditorTools.module.scss'
import { useForceUpdate } from '@/tools/hooks'
import { SpriteEditorTool } from '@/pages/sprite-editor/controller/editor-tools/types'

export const SpriteEditorTools: FC = () => {
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
    <>
      <WidgetBox>
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
        <div>
          <div className={styles.colors}>
            <div className={styles.colorPrimary}>
              <div className={styles.colorBox} style={{ backgroundColor: ImageEditor.color.primaryColor }}></div>
            </div>
            <div className={styles.colorSecondary}>
              <div className={styles.colorBox} style={{ backgroundColor: ImageEditor.color.secondaryColor }}></div>
            </div>
          </div>
        </div>
      </WidgetBox >
    </>
  )
}

