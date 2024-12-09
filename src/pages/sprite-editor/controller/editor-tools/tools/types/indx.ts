import { CanvasMouseEvent } from '../../../../presentation/utils'

export type EditorTool = {
  enable: () => void | Promise<void>
  disable: () => void | Promise<void>
  onMouseMove: (e: CanvasMouseEvent) => void | Promise<void>
  onMouseDown: (e: CanvasMouseEvent) => void | Promise<void>
  onMouseUp: (e: CanvasMouseEvent) => void | Promise<void>
}
