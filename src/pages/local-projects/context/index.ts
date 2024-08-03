import { createContextProvider } from '../../../tools/utils'
import { useEffect, useState } from 'react'
import { LocalProject, LocalProjectNew } from '../../../data-providers/local-projects/types'
import { LocalProjectsDataProvider } from '../../../data-providers/local-projects'
import { useActiveProjectContext } from '../../../global-contexts/active-project'

const [useLocalProjectsContext, LocalProjectsContextProvider] = createContextProvider(
  'LocalProjectsContext',
  () => {
    const { loadProject } = useActiveProjectContext()

    const [projects, setProjects] = useState<LocalProject[]>([])

    const createProject = (projectOptions: LocalProjectNew): void => {
      const { id } = LocalProjectsDataProvider.createLocalProject(projectOptions)
      refreshProjects()
      loadProject(id)
    }

    const deleteProject = (id: string): void => {
      LocalProjectsDataProvider.deleteLocalProject(id)
      refreshProjects()
    }

    const refreshProjects = (): void => {
      const projects = LocalProjectsDataProvider.getLocalProjects()
      setProjects(projects)
    }

    useEffect(refreshProjects, [])

    return { createProject, deleteProject, projects }
  }
)

export { useLocalProjectsContext, LocalProjectsContextProvider }
