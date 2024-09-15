import { WidgetBox } from '../../../../../tools/ui-components/widget-box/WidgetBox'
import { useSpriteEditorContext } from '../../../context'
import { FC } from 'react'

export const SpriteEditorInfo: FC = () => {
  const {
    editorImage
  } = useSpriteEditorContext()


  return <>
    <WidgetBox title="Info">
      <div>Size:{editorImage.width} x {editorImage.height} </div>
      <div>Offset: x:{editorImage.viewBox.position.x} y:{editorImage.viewBox.position.y}</div>
      <div>Zoom: {editorImage.zoom}</div>
    </WidgetBox >
  </>
}

