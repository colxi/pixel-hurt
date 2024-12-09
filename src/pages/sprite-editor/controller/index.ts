import { EditorHistory } from './action-history'
import { CanvasMouse } from './canvas-mouse'
import { EditorImage } from './editor-image'
import { EditorTools } from './editor-tools'
import { EditorEventBus } from './event-bus'

export class ImageEditor {
  static eventBus = new EditorEventBus()
  static image = new EditorImage({ eventBus: this.eventBus })
  static mouse = new CanvasMouse()
  static history = new EditorHistory({
    eventBus: this.eventBus,
    onAdd: (action) => {
      const arrayBuffer = new ArrayBuffer(
        this.image.size.w * this.image.size.h * 4
      )
      const imageData = new Uint8ClampedArray(arrayBuffer)
      imageData.set(this.image.imageBuffer)
      return { action: action, data: imageData }
    },
    onChange: (entry) => {
      this.image.imageBuffer.set(entry.data)
    },
  })

  static tools = new EditorTools({
    image: this.image,
    mouse: this.mouse,
    history: this.history,
    eventBus: this.eventBus,
  })
}
