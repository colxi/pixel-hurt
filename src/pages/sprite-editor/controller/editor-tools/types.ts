import { CanvasMouseEvent } from '../../presentation/utils'
import { EditorHistory } from '../action-history'
import { CanvasMouse } from '../canvas-mouse'
import { EditorColor } from '../editor-color'
import { EditorImage } from '../editor-image'
import { EditorEventBus } from '../event-bus'

export interface EditorToolsOptions {
  image: EditorImage
  mouse: CanvasMouse
  history: EditorHistory
  eventBus: EditorEventBus
  color: EditorColor
}

export type EditorTool = {
  enable: () => void
  disable: () => void
  onMouseMove: (e: CanvasMouseEvent) => void | Promise<void>
  onMouseDown: (e: CanvasMouseEvent) => void | Promise<void>
  onMouseUp: (e: CanvasMouseEvent) => void | Promise<void>
}

export type ToolsMap = Record<SpriteEditorTool, EditorTool>

export enum SpriteEditorTool {
  MOVE = 'MOVE',
  BRUSH = 'BRUSH',
  ERASER = 'ERASER',
  HAND = 'HAND',
  ZOOM = 'ZOOM',
  EYE_DROPPER = 'EYE_DROPPER',
  PAINT_BUCKET = 'PAINT_BUCKET',
}
