import { ActiveProjectContextProvider } from '../../../global-contexts/active-project'
import { AppRouterContextProvider } from '../../../global-contexts/app-router'
import { FPSMonitor } from '../../../tools/ui-components/fps-monitor/FPSMonitor'
import { ApplicationHeader } from './ApplicationHeader'
import { ApplicationViewsViewPort } from './ApplicationViewsViewPort'

export function ApplicationLayout() {
  return (
    <>
      <FPSMonitor />
      <AppRouterContextProvider>
        <ActiveProjectContextProvider>
          <ApplicationHeader />
          <ApplicationViewsViewPort />
        </ActiveProjectContextProvider>
      </AppRouterContextProvider>
    </>
  )
}

