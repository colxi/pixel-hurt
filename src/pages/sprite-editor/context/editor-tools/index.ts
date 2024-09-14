import { useState } from 'react'
import { SpriteEditorTool } from '../../types'
import { CanvasMouse } from '../canvas-mouse'
import { ActionHistory } from '../action-history'
import { EditorImage } from '../editor-image'
import { useBrushTool } from './tools/brush'
import { EditorTool } from './tools/types/indx'
import { noOpTool } from './tools/noop'
import { useHandTool } from './tools/hand'

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

  const tool = {
    [SpriteEditorTool.BRUSH]: useBrushTool(
      editorImage,
      canvasMouse,
      actionHistory
    ),
    [SpriteEditorTool.ERASER]: noOpTool(),
    [SpriteEditorTool.HAND]: useHandTool(editorImage, canvasMouse),
    [SpriteEditorTool.MOVE]: noOpTool(),
    [SpriteEditorTool.ZOOM]: noOpTool(),
  } satisfies Record<SpriteEditorTool, EditorTool>

  return {
    tool,
    activeEditorTool,
    setActiveEditorTool,
  }
}
