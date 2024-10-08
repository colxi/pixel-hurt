import { useEffect, useState } from 'react'
import { useSpriteEditorContext } from '../../context'
import { useEvent } from '../../../../tools/hooks'
import { SpriteEditorTool } from '../../types'

interface UseSpriteEditorCanvasKeyBindings {
  redo: () => void | Promise<void>
  undo: () => void | Promise<void>
}

export const useSpriteEditorCanvasKeyBindings = (
  handlers: UseSpriteEditorCanvasKeyBindings
) => {
  const { editorTools } = useSpriteEditorContext()
  const [lastTool, setLastTool] = useState(SpriteEditorTool.BRUSH)

  const handleKeyDown = useEvent(async (e: KeyboardEvent) => {
    // allow page reload with metaKey+R, but disable the rest of browser shortcuts
    if (e.code === 'KeyR' && e.metaKey) return
    else e.preventDefault()

    if (e.code === 'KeyZ' && e.metaKey && e.shiftKey) await handlers.redo()
    else if (e.code === 'KeyZ' && e.metaKey) await handlers.undo()
    else if (e.code === 'Space' && !e.metaKey) {
      if (editorTools.activeEditorTool !== SpriteEditorTool.HAND) {
        setLastTool(editorTools.activeEditorTool)
        editorTools.setActiveEditorTool(SpriteEditorTool.HAND)
      }
    }
  })

  const handleKeyUp = useEvent(async (e: KeyboardEvent) => {
    e.preventDefault()

    if (e.code === 'Space' && !e.metaKey) {
      editorTools.setActiveEditorTool(lastTool)
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
}
