import { FC, useEffect } from 'react'
import { LocalProjects } from '../../../pages/local-projects/presentation/LocalProjects'
import { useActiveProjectContext } from '../../active-project'
import { AppRoutesCollection } from '../types'
import { createRedirect, createRouteGuard } from '../utils'
import { localProjectsRoutes } from '../../../pages/local-projects/routes'
import { codeEditorRoutes } from '../../../pages/code-editor/routes'
import { spritesEditorRoutes } from '../../../pages/sprite-editor/routes'

export const appRoutesCatalog = {
  '/': createRedirect('/projects'),
  ...localProjectsRoutes,
  '/project': {
    children: {
      ...codeEditorRoutes,
      ...spritesEditorRoutes
    },
    guard: createRouteGuard((resolve) => {
      const { isProjectLoaded } = useActiveProjectContext()
      useEffect(() => resolve(isProjectLoaded), [isProjectLoaded])
    })
  },
  '*': createRedirect('/projects')
} satisfies AppRoutesCollection
