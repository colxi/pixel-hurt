import { HexColor } from '../../types'
import { EditorEventBus } from '../event-bus'

export interface EditorColorOptions {
  eventBus: EditorEventBus
}

export interface EditorPalette {
  id: string
  name: string
  colors: HexColor[]
}
