import { useEffect, useState, type FC } from 'react'
import styles from './FPSMonitor.module.css'
import { FramerateMonitor } from '../../utils/animation-engine'
import { useEvent } from '../../hooks'

const FPS_UPDATE_INTERVAL_IN_MILLIS = 1000

export const FPSMonitor: FC = () => {
  const [fps, setFps] = useState(0)
  const [monitor, setMonitor] = useState<FramerateMonitor | null>(null)

  const updateFps = useEvent(() => {
    if (!monitor) return
    setFps(monitor.getFPS())
  })

  const color = fps < 115 ? 'red' : 'green'

  useEffect(() => {
    const fpsMonitorInstance = new FramerateMonitor()
    fpsMonitorInstance.start()
    setInterval(updateFps, FPS_UPDATE_INTERVAL_IN_MILLIS)
    setMonitor(fpsMonitorInstance)
  }, [])

  return (
    <>
      <div className={styles.fpsMonitorContainer} style={{ backgroundColor: color }}>
        FPS: {fps}
      </div >
    </>
  )
}
