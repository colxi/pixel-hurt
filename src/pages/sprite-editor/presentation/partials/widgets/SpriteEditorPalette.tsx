import type { FC } from 'react'
import styled from 'styled-components'
import { WidgetBox } from '../../../../../tools/ui-components/widget-box/WidgetBox'

const PaletteItem = styled.div`
  width: 20px;
  height: 20px;
`

export const SpriteEditorPalette: FC = () => {
  const colors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff'
  ]

  return (
    <>
      <WidgetBox title="Palette">
        {colors.map((color, i) => (
          <PaletteItem style={{ backgroundColor: color }} key={i} />
        ))
        }
      </WidgetBox>
    </>
  )
}

