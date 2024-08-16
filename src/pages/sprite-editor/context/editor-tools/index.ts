import { useState } from 'react'
import { SpriteEditorTool } from '../../types'
import { CanvasMouse } from '../canvas-mouse'
import { ActionHistory } from '../action-history'
import { EditorImage } from '../editor-image'
import { EditorTool, noOpTool, useBrushTool } from './tools/brush'

interface Options {
  editorImage: EditorImage
  canvasMouse: CanvasMouse
  actionHistory: ActionHistory
}

export const useEditorTools = ({
  editorImage,
  canvasMouse,
  actionHistory,
}: Options) => {
  const [activeEditorTool, setActiveEditorTool] = useState(
    SpriteEditorTool.BRUSH
  )

  const tool: Record<SpriteEditorTool, EditorTool> = {
    [SpriteEditorTool.BRUSH]: useBrushTool(
      editorImage,
      canvasMouse,
      actionHistory
    ),
    [SpriteEditorTool.ERASER]: noOpTool(),
    [SpriteEditorTool.HAND]: noOpTool(),
    [SpriteEditorTool.MOVE]: noOpTool(),
    [SpriteEditorTool.ZOOM]: noOpTool(),
  }

  return {
    tool,
    activeEditorTool,
    setActiveEditorTool,
  }
}
