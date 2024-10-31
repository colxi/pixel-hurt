import fs from '@zenfs/core'
import { toDashedCase } from '../../tools/utils'
import { LocalProject, LocalProjectNew } from './types'
import { LocalProjectNewSchema } from './schemas'

// 📝 Maybe could be renamed to ProjectCatalog, UserProjects,  ProjectLibrary or ProjectArchive

const getLocalProjects = (): LocalProject[] => {
  if (!fs.existsSync('/projects')) fs.mkdirSync('/projects')

  const projectNames = fs.readdirSync('/projects')
  const projects = projectNames.map((projectName) => {
    const projectDirname = `/projects/${projectName}`
    const project = fs.readFileSync(`${projectDirname}/project.json`, { encoding: 'utf-8' })
    return JSON.parse(project)
  })
  LocalProjectNewSchema.array().parse(projects)
  return projects
}

const createLocalProject = (projectOptions: LocalProjectNew): LocalProject => {
  const projectId = toDashedCase(projectOptions.name)
  const project: LocalProject = {
    ...projectOptions,
    id: projectId
  }
  fs.mkdirSync(`/projects/${projectId}`)
  fs.writeFileSync(`/projects/${projectId}/project.json`, JSON.stringify(project), {
    encoding: 'utf-8'
  })
  return project
}

const deleteLocalProject = (id: LocalProject['id']): void => {
  fs.rmSync(`/projects/${id}`, { recursive: true })
}

export const LocalProjectsDataProvider = {
  getLocalProjects,
  createLocalProject,
  deleteLocalProject
}
