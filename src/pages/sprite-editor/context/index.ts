import { useEffect } from 'react'
import { createContextProvider } from '../../../tools/utils'
import { useActionHistory } from './action-history'
import { useCanvasMouse } from './canvas-mouse'
import { useEditorImage } from './editor-image'
import { useEditorTools } from './editor-tools'

export type UseSpriteEditor = ReturnType<typeof useSpriteEditorContext>

export const [useSpriteEditorContext, SpriteEditorContextProvider] =
  createContextProvider('SpriteEditorContext', () => {
    const canvasMouse = useCanvasMouse()

    const editorImage = useEditorImage()

    const actionHistory = useActionHistory({
      onAdd: (action) => {
        const arrayBuffer = new ArrayBuffer(
          editorImage.width * editorImage.height * 4
        )
        const imageData = new Uint8ClampedArray(arrayBuffer)
        imageData.set(editorImage.imageBuffer)
        return { action: action, data: imageData }
      },
      onChange: (entry) => {
        editorImage.imageBuffer.set(entry.data)
      },
    })

    const editorTools = useEditorTools({
      editorImage,
      canvasMouse,
      actionHistory,
    })

    return {
      actionHistory,
      editorImage,
      editorTools,
      canvasMouse,
    }
  })
