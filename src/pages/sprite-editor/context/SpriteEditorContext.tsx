import type { FC, ReactNode } from 'react'
import { createContext } from 'react'
import { useSpriteEditor } from './SpriteEditorContext.hook'
import type { UseSpriteEditor } from './SpriteEditorContext.hook'

export const SpriteEditorContext = createContext(null as unknown as UseSpriteEditor)

type SpriteEditorContextProviderProps = {
  children: ReactNode
}

export const SpriteEditorContextProvider: FC<SpriteEditorContextProviderProps> = ({ children }) => {
  return (
    <SpriteEditorContext.Provider value={useSpriteEditor()}>
      {children}
    </SpriteEditorContext.Provider>
  )
}

