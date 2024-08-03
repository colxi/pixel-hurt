import type { FC } from 'react'
import { useEffect } from 'react'
import { useSpriteEditorContext } from '../../context'
import { SpriteEditorTool } from '../../types'

import { WidgetBox } from '../../../../tools/ui-components/widget-box/WidgetBox'
import {
  CrossIcon,
  BrushIcon,
  EraserIcon,
  HandIcon,
  MagnifyingGlassIcon
} from '../../../../tools/ui-components/icons'


const hasKeyModifiers = (e: KeyboardEvent) => {
  return e.metaKey || e.shiftKey || e.ctrlKey
}

export const SpriteEditorTools: FC = () => {
  const { setActiveEditorTool } = useSpriteEditorContext()

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyB': {
        if (hasKeyModifiers(e)) return
        setActiveEditorTool(SpriteEditorTool.BRUSH)
        break
      }
      case 'KeyE': {
        if (hasKeyModifiers(e)) return
        setActiveEditorTool(SpriteEditorTool.ERASER)
        break
      }
      case 'KeyV': {
        if (hasKeyModifiers(e)) return
        setActiveEditorTool(SpriteEditorTool.MOVE)
        break
      }
      case 'KeyH': {
        if (hasKeyModifiers(e)) return
        setActiveEditorTool(SpriteEditorTool.HAND)
        break
      }
      case 'KeyZ': {
        if (hasKeyModifiers(e)) return
        setActiveEditorTool(SpriteEditorTool.ZOOM)
        break
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <>

      <WidgetBox>
        <CrossIcon />
        <BrushIcon />
        <EraserIcon />
        <HandIcon />
        <MagnifyingGlassIcon />
      </WidgetBox>
    </>
  )
}

