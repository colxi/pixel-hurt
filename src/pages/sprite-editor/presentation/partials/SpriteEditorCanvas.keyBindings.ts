import { useEffect } from 'react'
import { useSpriteEditorContext } from '../../context'

interface UseSpriteEditorCanvasKeyBindings {
  redo: () => void | Promise<void>
  undo: () => void | Promise<void>
}

export const useSpriteEditorCanvasKeyBindings = (handlers: UseSpriteEditorCanvasKeyBindings) => {
  const { editorHistory } = useSpriteEditorContext()

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.code === 'KeyR' && e.metaKey) return
    e.preventDefault()

    if (e.code === 'KeyZ' && e.metaKey && e.shiftKey) await handlers.redo()
    else if (e.code === 'KeyZ' && e.metaKey) await handlers.undo()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editorHistory.currentIndex])
}
