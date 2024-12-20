import { Route, Routes } from 'react-router-dom'
import { appRoutesCatalog } from '../../../../global-contexts/app-router/routes/routes'
import { CodeEditor } from '../../../code-editor/CodeEditor'
import { AppRouteOptions } from '../../../../global-contexts/app-router/types'
import styles from './ApplicationViewsViewport.module.scss'

export function ApplicationViewsViewport() {
  return (
    <>
      <div className={styles.qppViewViewsPort}>
        <CodeEditor />
        <Routes>
          {Object.entries<AppRouteOptions>(appRoutesCatalog).map(([routeName, { children, component, guard }]) =>
            (children)
              ? <Route path={routeName} Component={component || guard} key={routeName}>
                {Object.entries<AppRouteOptions>(children).map(([routeName, { children, component, guard }]) =>
                  <Route path={routeName} Component={component} key={routeName} />
                )}
              </Route>
              : <Route path={routeName} Component={component} key={routeName} />
          )}
        </Routes>
      </div>
    </>
  )
}

