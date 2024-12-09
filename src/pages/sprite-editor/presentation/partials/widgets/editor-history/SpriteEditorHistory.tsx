import { useEffect, type FC } from 'react'
import { WidgetBox } from '@/tools/ui-components/widget-box/WidgetBox'
import { formatBytes } from '@/tools/utils/formatters'
import { useForceUpdate } from '@/tools/hooks'
import { ImageEditor } from '../../../../controller'

export const SpriteEditorHistory: FC = () => {
  const { forceUpdate } = useForceUpdate()

  const getHistorySize = () => {
    let totalSize = 0
    ImageEditor.history.entries.forEach(item => totalSize += item.data.length)
    return formatBytes(totalSize)
  }

  useEffect(() => {
    ImageEditor.eventBus.subscribe(ImageEditor.eventBus.Event.HISTORY_CHANGE, forceUpdate)
    return () => ImageEditor.eventBus.unsubscribe(ImageEditor.eventBus.Event.HISTORY_CHANGE, forceUpdate)
  })

  return (
    <>
      <WidgetBox title="History">
        {ImageEditor.history.entries.map(
          (item, index) =>
            <div key={index} onClick={() => ImageEditor.history.load(index)}>
              {item.action}  {index === ImageEditor.history.currentIndex ? '<--' : ''}
            </div>
        )}
        <div>Used: {getHistorySize()}</div>
      </WidgetBox>
    </>
  )
}

