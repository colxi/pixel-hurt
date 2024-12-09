import { CanvasMouseEvent } from '../../../presentation/utils'

export const noOpTool = () => {
  return {
    enable: () => {},
    disable: () => {},
    onMouseMove: (_e: CanvasMouseEvent) => {},
    onMouseDown: (_e: CanvasMouseEvent) => {},
    onMouseUp: (_e: CanvasMouseEvent) => {},
  }
}
