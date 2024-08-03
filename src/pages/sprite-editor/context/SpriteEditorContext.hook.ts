import { useState } from 'react'
import type { Color } from '../types'
import { SpriteEditorTool } from '../types'
import { useSpriteEditorHistory } from './spriteEditorHistory'
import { debounce } from 'lodash-es'

export const useSpriteEditor = () => {
  const [spriteWidth] = useState(500)
  const [spriteHeight] = useState(500)
  const [activeEditorTool, setActiveEditorTool] = useState(SpriteEditorTool.BRUSH)
  const [spriteImageData] = useState(
    new Uint8ClampedArray(new ArrayBuffer(spriteWidth * spriteHeight * 4))
  )
  const editorHistory = useSpriteEditorHistory({
    action: 'Create',
    data: new Uint8ClampedArray(new ArrayBuffer(spriteWidth * spriteHeight * 4))
  })

  const paintPixel = async (x: number, y: number, color: Color) => {
    const offset = y * spriteWidth * 4 + x * 4
    spriteImageData[offset + 0] = color.r // red
    spriteImageData[offset + 1] = color.g // green
    spriteImageData[offset + 2] = color.b // blue
    spriteImageData[offset + 3] = color.a // alpha
  }

  const registerChanges = debounce((action: string) => {
    const arrayBuffer = new ArrayBuffer(spriteWidth * spriteHeight * 4)
    const imageData = new Uint8ClampedArray(arrayBuffer)
    imageData.set(spriteImageData)
    editorHistory.addEntry({ action, data: imageData })
    return
  }, 200)

  const undoLastChanges = () => {
    const entry = editorHistory.setPreviousEntry()
    if (entry) spriteImageData.set(entry.data)
  }

  const redoLastChanges = () => {
    const entry = editorHistory.setNextEntry()
    if (entry) spriteImageData.set(entry.data)
  }

  const loadChanges = (index: number) => {
    const entry = editorHistory.setEntryByIndex(index)
    if (entry) spriteImageData.set(entry.data)
  }

  return {
    paintPixel,
    redoLastChanges,
    undoLastChanges,
    loadChanges,
    setActiveEditorTool,
    registerChanges,
    spriteWidth,
    spriteHeight,
    spriteImageData,
    activeEditorTool,
    editorHistory: {
      currentIndex: editorHistory.currentIndex,
      entries: editorHistory.entries
    }
  }
}

export type UseSpriteEditor = ReturnType<typeof useSpriteEditor>
