import { debounce } from 'lodash-es'
import { useCallback, useState } from 'react'
import { useEvent } from '../../../../tools/hooks'

export interface SpriteEditorHistoryEntry {
  action: string
  data: Uint8ClampedArray
}

interface Options {
  onAdd: (action: string) => SpriteEditorHistoryEntry
  onChange: (entry: SpriteEditorHistoryEntry) => void
}

export class ActionHistory {
  constructor(options: Options) {
    this.#onAdd = options.onAdd
    this.#onChange = options.onChange
  }

  #currentIndex = 0
  #entries: SpriteEditorHistoryEntry[] = []
  #onChange: Options['onChange']
  #onAdd: Options['onAdd']

  public get currentIndex() {
    return this.#currentIndex
  }

  public get entries() {
    return this.#entries
  }

  private addEntry(entry: SpriteEditorHistoryEntry) {
    const isFirstItem = !this.#currentIndex && !this.#entries.length
    if (isFirstItem) this.#entries.push(entry)
    else {
      const newIndex = this.#currentIndex + 1
      this.#entries[newIndex] = entry
      const tail = this.#entries.length - 1 - newIndex
      if (tail) this.#entries.splice(-tail)
      this.#currentIndex = newIndex
    }
  }

  public undo() {
    const newIndex = this.#currentIndex - 1
    if (!this.#entries.length || !this.#currentIndex) return
    this.#currentIndex = newIndex
    this.#onChange(this.#entries[newIndex])
  }

  public redo() {
    const newIndex = this.#currentIndex + 1
    if (!this.#entries.length || newIndex > this.#entries.length - 1) return
    this.#currentIndex = newIndex
    this.#onChange(this.#entries[newIndex])
  }

  public load(index: number) {
    if (!this.#entries.length || index > this.#entries.length - 1) return
    this.#currentIndex = index
    this.#onChange(this.#entries[index])
  }

  public register = debounce((action: string) => {
    const data = this.#onAdd(action)
    this.addEntry(data)
  }, 200)
}

export type UseActionHistory = ReturnType<typeof useActionHistory>

interface Options {
  onAdd: (action: string) => SpriteEditorHistoryEntry
  onChange: (entry: SpriteEditorHistoryEntry) => void
}

export const useActionHistory = ({ onAdd, onChange }: Options) => {
  const [entries, setEntries] = useState<SpriteEditorHistoryEntry[]>([])
  const [currentIndex, setIndex] = useState(0)

  const addEntry = useEvent((entry: SpriteEditorHistoryEntry) => {
    const isFirstItem = !currentIndex && !entries.length
    if (isFirstItem) setEntries([entry])
    else {
      const newIndex = currentIndex + 1
      entries[newIndex] = entry
      const tail = entries.length - 1 - newIndex
      if (tail) entries.splice(-tail)
      setEntries(entries)
      setIndex(newIndex)
    }
  })

  const undo = () => {
    const newIndex = currentIndex - 1
    if (!entries.length || !currentIndex) return
    setIndex(newIndex)
    onChange(entries[newIndex])
  }

  const redo = () => {
    const newIndex = currentIndex + 1
    if (!entries.length || newIndex > entries.length - 1) return
    setIndex(newIndex)
    onChange(entries[newIndex])
  }

  const load = (index: number) => {
    if (!entries.length || index > entries.length - 1) return
    setIndex(index)
    onChange(entries[index])
  }

  const register = useCallback(
    debounce((action: string) => {
      const data = onAdd(action)
      addEntry(data)
      return
    }, 200),
    [currentIndex]
  )

  return {
    undo,
    redo,
    load,
    register,
    currentIndex,
    entries,
  }
}
