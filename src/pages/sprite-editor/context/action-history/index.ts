import { debounce } from 'lodash-es'
import { useCallback, useState } from 'react'

export interface SpriteEditorHistoryEntry {
  action: string
  data: Uint8ClampedArray
}

export type ActionHistory = ReturnType<typeof useActionHistory>

interface Options {
  collector: (action: string) => SpriteEditorHistoryEntry
}

export const useActionHistory = ({ collector }: Options) => {
  const [entries, setEntries] = useState<SpriteEditorHistoryEntry[]>([])
  const [currentIndex, setIndex] = useState(0)

  const addEntry = (entry: SpriteEditorHistoryEntry) => {
    const newIndex = currentIndex + 1
    entries[newIndex] = entry
    const tail = entries.length - 1 - newIndex
    if (tail) entries.splice(-tail)
    setEntries(entries)
    setIndex(newIndex)
  }

  const undo = () => {
    const newIndex = currentIndex - 1
    if (!entries.length || !currentIndex) return
    setIndex(newIndex)
  }

  const redo = () => {
    const newIndex = currentIndex + 1
    if (!entries.length || newIndex > entries.length - 1) return
    setIndex(newIndex)
  }

  const load = (index: number) => {
    if (!entries.length || index > entries.length - 1) return
    const nextImageData = entries[index]
    setIndex(index)
    return nextImageData
  }

  const register = useCallback(
    debounce((action: string) => {
      const data = collector(action)
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
