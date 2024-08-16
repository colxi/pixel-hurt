import type { FC } from 'react'
import { useSpriteEditorContext } from '../../context'
import { WidgetBox } from '../../../../tools/ui-components/widget-box/WidgetBox'


export const SpriteEditorHistory: FC = () => {
  const { actionHistory } = useSpriteEditorContext()

  return (
    <>
      <WidgetBox title="History">
        {actionHistory.entries.map(
          (item, index) =>
            <div key={index} onClick={() => actionHistory.load(index)}>
              {item.action}  {index === actionHistory.currentIndex ? '<--' : ''}
            </div>
        )}
      </WidgetBox>
    </>
  )
}

