import { useForceUpdate } from '@/tools/hooks'
import { WidgetBox } from '@/tools/ui-components/widget-box/WidgetBox'
import { ImageEditor } from '../../../../controller'
import { FC, useEffect } from 'react'

export const SpriteEditorInfo: FC = () => {
  const { forceUpdate } = useForceUpdate()

  const center = {
    x: Math.floor(ImageEditor.image.viewBox.position.x + ImageEditor.image.viewBox.size.w / 2),
    y: Math.floor(ImageEditor.image.viewBox.position.y + ImageEditor.image.viewBox.size.h / 2),
  }
  const viewBoxPositionX = Math.floor(ImageEditor.image.viewBox.position.x)
  const viewBoxPositionY = Math.floor(ImageEditor.image.viewBox.position.x)

  useEffect(() => {
    ImageEditor.eventBus.subscribe([
      ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE,
      ImageEditor.eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
      ImageEditor.eventBus.Event.HISTORY_CHANGE,
    ], forceUpdate)

    return () => {
      ImageEditor.eventBus.unsubscribe([
        ImageEditor.eventBus.Event.IMAGE_ZOOM_CHANGE,
        ImageEditor.eventBus.Event.IMAGE_VIEW_BOX_POSITION_CHANGE,
        ImageEditor.eventBus.Event.HISTORY_CHANGE,
      ], forceUpdate)
    }
  }, [])

  return <>
    <WidgetBox title="Info">
      <div>Size:{ImageEditor.image.size.w} x {ImageEditor.image.size.h} </div>
      <div>ViewBox</div>
      <div>Offset: x:{viewBoxPositionX} y:{viewBoxPositionY}</div>
      <div>Size: w:{ImageEditor.image.viewBox.size.w} h:{ImageEditor.image.viewBox.size.h}</div>
      <div>Center: x:{center.x} y:{center.y}</div>
      <div>Zoom: {ImageEditor.image.zoom}</div>
    </WidgetBox >
  </>
}

