import type { FC } from 'react'
import { ColorPicker } from './ColorPicker'
import styles from './SpriteEditorPalette.module.scss'
import { WidgetBox } from '@/tools/ui-components/widget-box/WidgetBox'
import { DropDown, DropDownItem, DropDownOptions } from '@/tools/ui-components/dropdown/DropDown'
import { palettes } from './constants'

export const SpriteEditorPalette: FC = () => {
  const colors = palettes[0].colors
  const options: DropDownOptions = {
    groups: [
      {
        name: 'Editor',
        items: palettes.map((palette) => ({ key: palette.name, value: palette.id }))
      }, {
        name: 'Project',
        items: []
      }
    ]
  }

  const rowRenderer = (item: DropDownItem) => {
    const palette = palettes.find((palette) => palette.id === item.value)
    if (!palette) throw new Error('Palette not found')
    return <>
      <div>{palette.name}</div>
      <div className={styles.dropDownItem}>
        {
          palette.colors.map(
            (color, i) => (
              <div key={i} className={styles.color} style={{ backgroundColor: color }} />
            ))
        }
      </div>
    </>
  }

  return (
    <>
      <WidgetBox title="Palette">
        <ColorPicker />
        <DropDown options={options} rowRenderer={rowRenderer} />
        <section className={styles.container}>
          {colors.map(
            (color, i) => (
              <div className={styles.item} style={{ backgroundColor: color }} key={i} />
            ))
          }
          <div className={styles.addItem}>+</div>
        </section>
      </WidgetBox>
    </>
  )
}

