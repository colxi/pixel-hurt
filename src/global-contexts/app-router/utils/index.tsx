import { Outlet, Navigate } from 'react-router-dom'
import { FC, useState } from 'react'
import { useAppRouter } from '..'
import { AppRouteName, AppRoutesCollection } from '../types'


type GuardResolver = (resolution: boolean, redirection?: AppRouteName) => void
type GuardHandler = (handler: GuardResolver) => void

export const createRouteGuard = (handler: GuardHandler): FC => {
  return () => {
    const [isAllowed, setIsAllowed] = useState(false)
    const { navigateTo } = useAppRouter()

    const resolver: GuardResolver = (resolution, redirection = '/') => {
      setIsAllowed(resolution)
      if (!resolution) navigateTo(redirection)
    }

    handler(resolver)

    return <>
      {isAllowed && <Outlet />}
    </>
  }
}


/**
 * 
 * 
 * 
 */
export const createRedirect = (to: string) => {
  const Redirect: FC = () => {
    return <Navigate to={to} />
  }

  return { component: Redirect }

}