import { useState } from 'react'
import { SpriteEditorTool } from '../../types'
import { CanvasMouse, CanvasMouseContext } from '../canvas-mouse'
import { ActionHistory, UseActionHistory } from '../action-history'
import { EditorImage, UseEditorImage } from '../editor-image'
import { BrushTool, useBrushTool } from './tools/brush'
import { EditorTool } from './tools/types/indx'
import { noOpTool } from './tools/noop'
import { HandTool, useHandTool } from './tools/hand'

interface EditorToolsOptions {
  editorImage: EditorImage
  canvasMouse: CanvasMouse
  actionHistory: ActionHistory
}

export class EditorTools {
  constructor({ editorImage, canvasMouse, actionHistory }: EditorToolsOptions) {
    this.#activeEditorTool = SpriteEditorTool.BRUSH
    this.#tool = {
      [SpriteEditorTool.BRUSH]: new BrushTool(
        editorImage,
        canvasMouse,
        actionHistory
      ),
      [SpriteEditorTool.HAND]: new HandTool(editorImage, canvasMouse),
      [SpriteEditorTool.ERASER]: noOpTool(),
      [SpriteEditorTool.MOVE]: noOpTool(),
      [SpriteEditorTool.ZOOM]: noOpTool(),
    }
  }

  #activeEditorTool = SpriteEditorTool.BRUSH
  #tool: Record<SpriteEditorTool, EditorTool>

  public get tool() {
    return this.#tool
  }

  public get activeEditorTool() {
    return this.#activeEditorTool
  }

  public setActiveEditorTool(tool: SpriteEditorTool) {
    this.#activeEditorTool = tool
  }
}

interface Options {
  editorImage: UseEditorImage
  canvasMouse: CanvasMouseContext
  actionHistory: UseActionHistory
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
