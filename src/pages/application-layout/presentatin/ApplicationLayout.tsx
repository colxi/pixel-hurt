import { ActiveProjectContextProvider } from '../../../global-contexts/active-project'
import { AppRouterContextProvider } from '../../../global-contexts/app-router'
import { ApplicationHeader } from './ApplicationHeader'
import { ApplicationViewsViewPort } from './ApplicationViewsViewPort'


export function ApplicationLayout() {
  return (
    <>
      <AppRouterContextProvider>
        <ActiveProjectContextProvider>
          <ApplicationHeader />
          <ApplicationViewsViewPort />
        </ActiveProjectContextProvider>
      </AppRouterContextProvider>
    </>
  )
}

