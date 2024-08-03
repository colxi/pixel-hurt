import { AppRoutesCollection } from '../../../global-contexts/app-router/types'
import { LocalProjects } from '../presentation/LocalProjects'

export const localProjectsRoutes = {
  '/projects': { component: LocalProjects }
} satisfies AppRoutesCollection
