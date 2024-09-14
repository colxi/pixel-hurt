import { useMemo, type FC } from 'react'
import { useSpriteEditorContext } from '../../../context'
import { WidgetBox } from '../../../../../tools/ui-components/widget-box/WidgetBox'
import sizeof from 'object-sizeof'


function formatBytes(bytes: number, decimals: number = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const SpriteEditorHistory: FC = () => {
  const { actionHistory } = useSpriteEditorContext()

  const size = useMemo(() => {
    let total = 0
    actionHistory.entries.forEach(item => total += item.data.length)
    return formatBytes(total)
  }, [actionHistory.currentIndex])

  return (
    <>
      <WidgetBox title="History">
        {actionHistory.entries.map(
          (item, index) =>
            <div key={index} onClick={() => actionHistory.load(index)}>
              {item.action}  {index === actionHistory.currentIndex ? '<--' : ''}
            </div>
        )}
        <div>Used: {size}</div>
      </WidgetBox>
    </>
  )
}

