import { useContext } from 'react'
import { SpriteEditorContext } from './SpriteEditorContext'

export const useSpriteEditorContext = () => {
  const context = useContext(SpriteEditorContext)
  if (!context) throw new Error('🔥 SpriteEditorContext not available!')
  return context
}
