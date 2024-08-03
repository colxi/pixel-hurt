import { useNavigate } from 'react-router-dom'
import { useActiveProjectContext } from '../../../global-contexts/active-project'
import { useLocalProjectsContext } from '../context'


export const LocalProjectsList = () => {
  const { deleteProject, projects } = useLocalProjectsContext()
  const { loadProject } = useActiveProjectContext()
  const navigate = useNavigate()

  const onDeleteProjectClick = (id: string) => {
    deleteProject(id)
  }

  const onLoadProjectClick = (id: string) => {
    loadProject(id)
    navigate('/project/sprites')
  }

  return <>
    <div>
      {projects.map((project) =>
        <div key={project.id}>
          <div>{project.name}</div>
          <div>{project.id}</div>
          <button onClick={() => onDeleteProjectClick(project.id)}>Delete</button>
          <button onClick={() => onLoadProjectClick(project.id)}>Open</button>
        </div>)}
    </div>
  </>
}