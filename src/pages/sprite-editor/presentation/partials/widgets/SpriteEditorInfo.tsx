import { WidgetBox } from '../../../../../tools/ui-components/widget-box/WidgetBox'
import { useSpriteEditorContext } from '../../../context'
import { FC } from 'react'

export const SpriteEditorInfo: FC = () => {
  const {
    editorImage
  } = useSpriteEditorContext()

  const center = {
    x: Math.round(editorImage.viewBox.position.x + editorImage.viewBox.size.w / 2),
    y: Math.round(editorImage.viewBox.position.y + editorImage.viewBox.size.h / 2),
  }

  return <>
    <WidgetBox title="Info">
      <div>Size:{editorImage.width} x {editorImage.height} </div>
      <div>ViewBox</div>
      <div>Offset: x:{editorImage.viewBox.position.x} y:{editorImage.viewBox.position.y}</div>
      <div>Size: w:{editorImage.viewBox.size.w} h:{editorImage.viewBox.size.h}</div>
      <div>Center: x:{center.x} y:{center.y}</div>
      <div>Zoom: {editorImage.zoom}</div>
    </WidgetBox >
  </>
}

