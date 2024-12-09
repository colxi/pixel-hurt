import { EditorEventBus } from '../event-bus'

export interface EditorHistoryEntry {
  action: string
  data: Uint8ClampedArray
}

export interface EditorHistoryOptions {
  eventBus: EditorEventBus
  onAdd: (action: string) => EditorHistoryEntry
  onChange: (entry: EditorHistoryEntry) => void
}
