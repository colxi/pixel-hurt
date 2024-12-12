import { CanvasMouse } from '../canvas-mouse'
import { EditorHistory } from '../action-history'
import { EditorImage } from '../editor-image'
import { BrushTool } from './tools/brush'
import { noOpTool } from './tools/noop'
import { HandTool } from './tools/hand'
import { EditorToolsOptions, SpriteEditorTool, ToolsMap } from './types'
import { EditorEventBus } from '../event-bus'
import { EditorColor } from '../editor-color'
import { EyeDropperTool } from './tools/eye-dropper'
import { hasKeyModifiers } from '@/tools/utils/keyboard'
import { PaintBucketTool } from './tools/paint-bucket'

export class EditorTools {
  constructor({ image, mouse, history, eventBus, color }: EditorToolsOptions) {
    this.#activeToolName = SpriteEditorTool.BRUSH
    this.#image = image
    this.#mouse = mouse
    this.#history = history
    this.#eventBus = eventBus
    this.#color = color
    this.#tools = this.getToolsMap()
    this.onKeyDown = this.onKeyDown.bind(this)
    window.addEventListener('keydown', this.onKeyDown)
    this.activeTool.enable()
  }

  #image: EditorImage
  #mouse: CanvasMouse
  #color: EditorColor
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
      [SpriteEditorTool.BRUSH]: new BrushTool({
        color: this.#color,
        image: this.#image,
        mouse: this.#mouse,
        history: this.#history,
      }),
      [SpriteEditorTool.EYE_DROPPER]: new EyeDropperTool({
        color: this.#color,
        image: this.#image,
        mouse: this.#mouse,
      }),
      [SpriteEditorTool.PAINT_BUCKET]: new PaintBucketTool({
        color: this.#color,
        image: this.#image,
        mouse: this.#mouse,
        history: this.#history,
      }),
      [SpriteEditorTool.HAND]: new HandTool({
        image: this.#image,
        mouse: this.#mouse,
      }),
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
      case 'KeyI': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.EYE_DROPPER)
        break
      }
      case 'KeyG': {
        if (hasKeyModifiers(e)) return
        this.setActiveToolName(SpriteEditorTool.PAINT_BUCKET)
        break
      }
    }
  }

  public setActiveToolName(tool: SpriteEditorTool) {
    this.activeTool.disable()
    this.#activeToolName = tool
    this.activeTool.enable()
    this.#eventBus.dispatch(this.#eventBus.Event.TOOL_CHANGE, {})
  }
}
