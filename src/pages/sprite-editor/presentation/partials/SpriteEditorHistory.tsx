import type { FC } from 'react'
import { useSpriteEditorContext } from '../../context'
import { WidgetBox } from '../../../../tools/ui-components/widget-box/WidgetBox'


export const SpriteEditorHistory: FC = () => {
  const { editorHistory, loadChanges } = useSpriteEditorContext()

  return (
    <>
      <WidgetBox title="History">
        {editorHistory.entries.map(
          (item, index) =>
            <div key={index} onClick={() => loadChanges(index)}>
              {item.action}  {index === editorHistory.currentIndex ? '<--' : ''}
            </div>
        )}
      </WidgetBox>
    </>
  )
}

