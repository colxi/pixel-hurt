import { useMemo, useState } from 'react'
import { useLocalProjectsContext } from '../context'
import { toDashedCase } from '../../../tools/utils'
import { useNavigate } from 'react-router-dom'


export const LocalProjectsNew = () => {
  const { createProject, projects } = useLocalProjectsContext()
  const navigate = useNavigate()

  const [projectName, setProjectName] = useState('')

  const isProjectNameAvailable = useMemo(() => {
    const projectId = toDashedCase(projectName)
    const projectNames = projects.map((project) => project.id)
    return !projectNames.includes(projectId)
  }, [projects, projectName])


  const onCreateProjectClick = () => {
    createProject({ name: projectName.trim() })
    setProjectName('')
    navigate('/project/sprites')
  }

  const onProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  return <>
    <div>
      <input type="text" value={projectName} onChange={onProjectNameChange} />
      {!isProjectNameAvailable && <div>Project name is not available</div>}
      <button onClick={onCreateProjectClick}>Create</button>
    </div>
  </>
}