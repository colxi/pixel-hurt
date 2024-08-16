import { useEffect, useMemo, useState } from 'react'
import { createContextProvider } from '../../tools/utils'
import { LocalProject } from '../../data-providers/local-projects/types'
import { LocalProjectsDataProvider } from '../../data-providers/local-projects'
import { useAppRouter } from '../app-router'

const [useActiveProjectContext, ActiveProjectContextProvider] =
  createContextProvider('ActiveProjectContext', () => {
    const [project, setProject] = useState<LocalProject | null>(null)
    const isProjectLoaded = useMemo(() => Boolean(project), [project])

    const loadProject = (projectId: LocalProject['id']) => {
      const projects = LocalProjectsDataProvider.getLocalProjects()
      const project = projects.find((project) => project.id === projectId)
      if (!project) throw new Error(`Project with id "${projectId}" not found`)
      setProject(project)
    }

    const closeProject = () => {
      setProject(null)
    }

    // delete this automatic project load (only used for dev)
    const { navigateTo } = useAppRouter()
    useEffect(() => {
      loadProject('test')
      navigateTo('/project/sprites')
    }, [])

    return {
      loadProject,
      closeProject,
      isProjectLoaded,
      get project() {
        if (!project) {
          throw new Error(
            'Project is not loaded, use isProjectLoaded to check before consuming it'
          )
        }
        return project
      },
    }
  })

export { useActiveProjectContext, ActiveProjectContextProvider }
