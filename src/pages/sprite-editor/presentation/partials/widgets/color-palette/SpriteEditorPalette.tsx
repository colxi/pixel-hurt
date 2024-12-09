import { useEffect, type FC } from 'react'
import { ColorPicker } from './ColorPicker'
import styles from './SpriteEditorPalette.module.scss'
import { WidgetBox } from '@/tools/ui-components/widget-box/WidgetBox'
import { DropDown, DropDownItem, DropDownOptions } from '@/tools/ui-components/dropdown/DropDown'
import { ImageEditor } from '@/pages/sprite-editor/controller'
import { useForceUpdate } from '@/tools/hooks'
import { HexColor } from '@/pages/sprite-editor/types'

export const SpriteEditorPalette: FC = () => {
  const { forceUpdate } = useForceUpdate()

  const colors = ImageEditor.color.palettes[0].colors
  const options: DropDownOptions = {
    groups: [
      {
        name: 'Editor',
        items: ImageEditor.color.palettes.map((palette) => ({ key: palette.name, value: palette.id }))
      }, {
        name: 'Project',
        items: []
      }
    ]
  }

  const rowRenderer = (item: DropDownItem) => {
    const palette = ImageEditor.color.palettes.find((palette) => palette.id === item.value)
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

  const handleColorLeftClick = (color: HexColor) => {
    ImageEditor.color.setPrimaryColor(color)
  }

  const handleColorRightClick = (color: HexColor) => {
    ImageEditor.color.setSecondaryColor(color)
  }

  useEffect(() => {
    ImageEditor.eventBus.subscribe(ImageEditor.eventBus.Event.PRIMARY_COLOR_CHANGE, forceUpdate)
    return () => {
      ImageEditor.eventBus.unsubscribe(ImageEditor.eventBus.Event.PRIMARY_COLOR_CHANGE, forceUpdate)
    }
  })

  return (
    <>
      <WidgetBox title="Palette">
        <ColorPicker />
        <DropDown options={options} rowRenderer={rowRenderer} />
        <section className={styles.container}>
          {colors.map(
            (color, i) => (
              <div
                className={styles.item}
                data-active={color === ImageEditor.color.primaryColor}
                style={{ backgroundColor: color }}
                key={i}
                onClick={() => handleColorLeftClick(color)}
                onContextMenu={() => handleColorRightClick(color)}
              />
            ))
          }
          <div className={styles.addItem}>+</div>
        </section>
      </WidgetBox>
    </>
  )
}

