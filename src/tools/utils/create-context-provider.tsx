import { createContext, FC, ReactNode, useContext } from 'react'

type ProviderProps = { children: ReactNode }

export const createContextProvider = <
  CONTEXT_DATA extends object
>(
  contextName: string,
  contextHook: () => CONTEXT_DATA
): [
    useContextHook: () => CONTEXT_DATA,
    ContextProvider: FC<ProviderProps>
  ] => {
  const Context = createContext(null as unknown as CONTEXT_DATA)

  const ContextProvider: FC<ProviderProps> = ({ children }) => {
    return (
      <Context.Provider value={contextHook()}>
        {children}
      </Context.Provider>
    )
  }

  const useContextHook = () => {
    const context = useContext(Context)
    if (!context) throw new Error(`Context ${contextName} not available!`)
    return context
  }

  return [useContextHook, ContextProvider]
}