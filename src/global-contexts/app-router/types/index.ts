import { FC } from 'react'
import { appRoutesCatalog } from '../routes/routes'

type ObjectKeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]
type AllObjectUnionKeys<T> = T extends any ? keyof T : never

type RouteWithoutChildren = {
  component?: FC
  guard?: FC
  children?: AppRoutesCollection
}

type RouteWithChildren = RouteWithoutChildren & { children: AppRoutesCollection }

type AppRoutes = typeof appRoutesCatalog
type RootRoutesWithChildren = ObjectKeysMatching<AppRoutes, RouteWithChildren>
type RootRoutesWithoutChildren = Exclude<keyof AppRoutes, RootRoutesWithChildren>
type ChildrenRoutes = AllObjectUnionKeys<AppRoutes[RootRoutesWithChildren]['children']>

export type AppRouteOptions = RouteWithoutChildren | RouteWithChildren
export type AppRouteName = RootRoutesWithoutChildren | ChildrenRoutes
export type AppRoutesCollection = Record<string, AppRouteOptions>
