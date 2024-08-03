import styled from 'styled-components'
import { NavLink, Route } from 'react-router-dom'
import { useActiveProjectContext } from '../../../global-contexts/active-project'
import { useEffect } from 'react'

const TabButton = styled(Route)`
  color: white;
  display:inline-block;
  margin-right: 10px;
`

export function ApplicationHeader() {
  const { closeProject } = useActiveProjectContext()

  const onClick = () => {
    closeProject()
  }

  return (
    <>
      <div>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/project/code">Code</NavLink>
        <NavLink to="/project/sprites">Sprites</NavLink>
        {/* <NavLink to="/project/tiles">Tiles</NavLink>
        <NavLink to="/project/map">Map</NavLink>
        <NavLink to="/project/samples">Sounds</NavLink>
        <NavLink to="/project/tracks">Tracks</NavLink>
        <NavLink to="/project/run">Run</NavLink>
        <NavLink to="/community">Community</NavLink> */}
        <span onClick={onClick}>Close</span>
      </div >
    </>
  )
}

