import { ApplicationLayout } from './pages/application-layout/presentatin/ApplicationLayout'
import { disableMouseZoom } from './tools/utils/mouse-zoom'


export function App() {
  disableMouseZoom()

  return (
    <>
      <ApplicationLayout />
    </>
  )
}

