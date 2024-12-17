import { NavLink } from 'react-router-dom'
import { useActiveProjectContext } from '../../../../global-contexts/active-project'
import styles from './ApplicationHeader.module.scss'

export function ApplicationHeader() {
  const { closeProject } = useActiveProjectContext()

  const handleCloseClick = () => {
    closeProject()
  }

  return (
    <>
      <div className={styles.qppNavigation}>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/project/code">Code</NavLink>
        <NavLink to="/project/sprites">Sprites</NavLink>
        {/* <NavLink to="/project/tiles">Tiles</NavLink>
        <NavLink to="/project/map">Map</NavLink>
        <NavLink to="/project/samples">Sounds</NavLink>
        <NavLink to="/project/tracks">Tracks</NavLink>
        <NavLink to="/project/run">Run</NavLink>
        <NavLink to="/community">Community</NavLink> */}
        <span onClick={handleCloseClick}>Close</span>
      </div >
    </>
  )
}

