// Error

import fs from '@zenfs/core'

export const throwError = (e: unknown) => {
  throw e
}

// Time

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Array

export const finByIndex = <T extends Record<any, any>, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K]
) => {
  const result = array.find((item) => item[key] === value)
  if (!result) throw new Error('[finByIndex]: Index not found in array')
  return result
}

// String

export const toDashedCase = (str: string) => {
  return str.replace(/\s+/g, '-').toLowerCase()
}

// Context Provider
export { createContextProvider } from './create-context-provider'

// FS
export const rmdirRecursiveSync = (path: string) => {
  for (const item of fs.readdirSync(path)) {
    const itemPath = `${path}/${item}`
    const stats = fs.statSync(itemPath)
    if (stats.isDirectory()) {
      rmdirRecursiveSync(itemPath)
    } else fs.rmSync(itemPath)
  }
  fs.rmdirSync(`${path}`)
}
