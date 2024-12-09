import { debounce } from 'lodash-es'
import { EditorHistoryEntry, EditorHistoryOptions } from './types'
import { EditorEventBus } from '../event-bus'

export class EditorHistory {
  constructor({ onAdd, onChange, eventBus }: EditorHistoryOptions) {
    this.#onAdd = onAdd
    this.#onChange = onChange
    this.#eventBus = eventBus

    this.undo = this.undo.bind(this)
    this.redo = this.redo.bind(this)
  }

  #currentIndex = 0
  #entries: EditorHistoryEntry[] = []
  #eventBus: EditorEventBus
  #onChange: EditorHistoryOptions['onChange']
  #onAdd: EditorHistoryOptions['onAdd']

  public get currentIndex() {
    return this.#currentIndex
  }
  public get entries() {
    return this.#entries
  }

  private emitHistoryChangeEvent() {
    this.#eventBus.dispatch(this.#eventBus.Event.HISTORY_CHANGE, {})
  }

  public undo() {
    const newIndex = this.#currentIndex - 1
    if (!this.#entries.length || !this.#currentIndex) return
    this.#currentIndex = newIndex
    this.#onChange(this.#entries[newIndex])
    this.emitHistoryChangeEvent()
  }

  public redo() {
    const newIndex = this.#currentIndex + 1
    if (!this.#entries.length || newIndex > this.#entries.length - 1) return
    this.#currentIndex = newIndex
    this.#onChange(this.#entries[newIndex])
    this.emitHistoryChangeEvent()
  }

  public load(index: number) {
    if (!this.#entries.length || index > this.#entries.length - 1) return
    this.#currentIndex = index
    this.#onChange(this.#entries[index])
    this.emitHistoryChangeEvent()
  }

  public register = debounce((action: string) => {
    const entry = this.#onAdd(action)
    const isFirstItem = !this.#currentIndex && !this.#entries.length
    if (isFirstItem) this.#entries.push(entry)
    else {
      const newIndex = this.#currentIndex + 1
      this.#entries[newIndex] = entry
      const tail = this.#entries.length - 1 - newIndex
      if (tail) this.#entries.splice(-tail)
      this.#currentIndex = newIndex
    }
    this.emitHistoryChangeEvent()
  }, 200)
}
