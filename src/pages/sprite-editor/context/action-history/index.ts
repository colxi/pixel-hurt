import { debounce } from 'lodash-es'
import { useCallback, useState } from 'react'
import { useEvent } from '../../../../tools/hooks'

export interface SpriteEditorHistoryEntry {
  action: string
  data: Uint8ClampedArray
}

export type ActionHistory = ReturnType<typeof useActionHistory>

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
