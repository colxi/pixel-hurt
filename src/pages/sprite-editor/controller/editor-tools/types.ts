import { SpriteEditorTool } from '../../types'
import { EditorHistory } from '../action-history'
import { CanvasMouse } from '../canvas-mouse'
import { EditorImage } from '../editor-image'
import { EditorEventBus } from '../event-bus'
import { EditorTool } from './tools/types/indx'

export interface EditorToolsOptions {
  image: EditorImage
  mouse: CanvasMouse
  history: EditorHistory
  eventBus: EditorEventBus
}

export type ToolsMap = Record<SpriteEditorTool, EditorTool>
