import { useState } from 'react'

export interface SpriteEditorHistoryEntry {
  action: string
  data: Uint8ClampedArray
}

export const useSpriteEditorHistory = (entry: SpriteEditorHistoryEntry) => {
  const [entries, setEntries] = useState<SpriteEditorHistoryEntry[]>([entry])
  const [currentIndex, setIndex] = useState(0)

  const addEntry = (entry: SpriteEditorHistoryEntry) => {
    const newIndex = currentIndex + 1
    entries[newIndex] = entry
    const tail = entries.length - 1 - newIndex
    if (tail) entries.splice(-tail)
    setEntries(entries)
    setIndex(newIndex)
  }

  const setPreviousEntry = () => {
    const newIndex = currentIndex - 1
    if (!entries.length || !currentIndex) return
    const previousImageData = entries[newIndex]
    setIndex(newIndex)
    return previousImageData
  }

  const setNextEntry = () => {
    const newIndex = currentIndex + 1
    if (!entries.length || newIndex > entries.length - 1) return
    const nextImageData = entries[newIndex]
    setIndex(newIndex)
    return nextImageData
  }

  const setEntryByIndex = (index: number) => {
    if (!entries.length || index > entries.length - 1) return
    const nextImageData = entries[index]
    setIndex(index)
    return nextImageData
  }

  return {
    addEntry,
    setNextEntry,
    setEntryByIndex,
    setPreviousEntry,
    currentIndex,
    entries
  }
}
