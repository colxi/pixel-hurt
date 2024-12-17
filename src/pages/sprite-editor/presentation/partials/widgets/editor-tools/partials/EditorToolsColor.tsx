import { useEffect, type FC } from 'react'
import { ImageEditor } from '@/pages/sprite-editor/controller'
import { useForceUpdate } from '@/tools/hooks'
import { SwitchIcon } from '@/tools/ui-components/icons'
import styles from './EditorToolsColor.module.scss'
import { formatRgbaColorAsHex } from '@/tools/utils/formatters'

export const EditorToolsColor: FC = () => {
  const { forceUpdate } = useForceUpdate()

  const handleBlackAndWhiteClick = () => {
    ImageEditor.color.setPrimaryColor({ r: 0, g: 0, b: 0, a: 255 })
    ImageEditor.color.setSecondaryColor({ r: 255, g: 255, b: 255, a: 255 })
  }

  const handleSwitchColorsClick = () => {
    const primaryColor = ImageEditor.color.primaryColor
    const secondaryColor = ImageEditor.color.secondaryColor
    ImageEditor.color.setPrimaryColor(secondaryColor)
    ImageEditor.color.setSecondaryColor(primaryColor)
  }

  useEffect(() => {
    ImageEditor.eventBus.subscribe([
      ImageEditor.eventBus.Event.PRIMARY_COLOR_CHANGE,
      ImageEditor.eventBus.Event.SECONDARY_COLOR_CHANGE
    ], forceUpdate)
    return () => {
      ImageEditor.eventBus.unsubscribe([
        ImageEditor.eventBus.Event.PRIMARY_COLOR_CHANGE,
        ImageEditor.eventBus.Event.SECONDARY_COLOR_CHANGE
      ], forceUpdate)
    }
  })

  return (
    <main>
      <section className={styles.colorOptions}>
        <div className={styles.blackAndWhite} onClick={handleBlackAndWhiteClick}>
          <div />
          <div />
        </div>
        <div className={styles.switchColors} onClick={handleSwitchColorsClick}>
          <SwitchIcon />
        </div>
      </section>

      <section className={styles.colors}>
        <div>
          <div style={{ backgroundColor: formatRgbaColorAsHex(ImageEditor.color.primaryColor) }} />
        </div>
        <div>
          <div style={{ backgroundColor: formatRgbaColorAsHex(ImageEditor.color.secondaryColor) }} />
        </div>
      </section>
    </main>
  )
}

