import { useCallback, useRef, useState, useInsertionEffect } from 'react'

// The useEvent API has not yet been added to React,
// so this is a temporary shim to make this sandbox work.
export function useEvent<T extends (...args: any[]) => void>(fn: T): T {
  const ref = useRef(fn)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])
  return useCallback((...args: any[]) => {
    const f = ref.current
    return f(...args)
  }, []) as T
}

export const useLocalContext = <T extends Record<string, any>>(data: T): T => {
  const [ctx] = useState<T>(data)
  for (const key in data) ctx[key] = data[key]
  return ctx
}
