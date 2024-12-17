import { ActiveProjectContextProvider } from '../../../global-contexts/active-project'
import { AppRouterContextProvider } from '../../../global-contexts/app-router'
import { FPSMonitor } from '../../../tools/ui-components/fps-monitor/FPSMonitor'
import { ApplicationHeader } from './partials/ApplicationHeader'
import { ApplicationViewsViewport } from './partials/ApplicationViewsViewport'
import styles from './ApplicationLayout.module.scss'

export function ApplicationLayout() {
  return (
    <div className={styles.app}>
      <FPSMonitor />
      <AppRouterContextProvider>
        <ActiveProjectContextProvider>
          <ApplicationHeader />
          <ApplicationViewsViewport />
        </ActiveProjectContextProvider>
      </AppRouterContextProvider>
    </div >
  )
}

