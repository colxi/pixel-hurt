import { SpriteEditorTool } from '../../types'
import { CanvasMouse } from '../canvas-mouse'
import { EditorHistory } from '../action-history'
import { EditorImage } from '../editor-image'
import { BrushTool } from './tools/brush'
import { EditorTool } from './tools/types/indx'
import { noOpTool } from './tools/noop'
import { HandTool } from './tools/hand'
import { EditorToolsOptions, ToolsMap } from './types'
import { EditorEventBus } from '../event-bus'

const hasKeyModifiers = (e: KeyboardEvent) => {
  return e.metaKey || e.shiftKey || e.ctrlKey
}

export class EditorTools {
  constructor({ image, mouse, history, eventBus }: EditorToolsOptions) {
    this.#activeToolName = SpriteEditorTool.BRUSH
    this.#image = image
    this.#mouse = mouse
    this.#history = history
    this.#eventBus = eventBus
    this.#tools = this.getToolsMap()
    this.onKeyDown = this.onKeyDown.bind(this)
    window.addEventListener('keydown', this.onKeyDown)
  }

  #image: EditorImage
  #mouse: CanvasMouse
  #history: EditorHistory
  #eventBus: EditorEventBus
  #activeToolName = SpriteEditorTool.BRUSH
  #tools: ToolsMap

  public readonly Tool = SpriteEditorTool

  public get activeTool() {
    return this.#tools[this.#activeToolName]
  }

  public get activeToolName() {
    return this.#activeToolName
  }

  private getToolsMap(): ToolsMap {
    return {
      [SpriteEditorTool.BRUSH]: new BrushTool(
        this.#image,
        this.#mouse,
        this.#history
      ),
      [SpriteEditorTool.HAND]: new HandTool(this.#image, this.#mouse),
      [SpriteEditorTool.ERASER]: noOpTool(),
      [SpriteEditorTool.MOVE]: noOpTool(),
      [SpriteEditorTool.ZOOM]: noOpTool(),
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyB': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.BRUSH)
        break
      }
      case 'KeyE': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.ERASER)
        break
      }
      case 'KeyV': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.MOVE)
        break
      }
      case 'KeyH': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.HAND)
        break
      }
      case 'KeyZ': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.ZOOM)
        break
      }
    }
  }

  public setActiveToolName(tool: SpriteEditorTool) {
    this.#activeToolName = tool
    this.#eventBus.dispatch(this.#eventBus.Event.TOOL_CHANGE, {})
  }
}
