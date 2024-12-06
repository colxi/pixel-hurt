import { useNavigate } from 'react-router-dom'
import { AppRouteName } from './types'
import { createContextProvider } from '../../tools/utils'
import { appRoutesCatalog } from './routes/routes'

const [useAppRouter, AppRouterContextProvider] = createContextProvider(
  'AppRouterContext',
  () => {
    const navigate = useNavigate()

    const navigateTo = (routeName: AppRouteName) => {
      navigate(routeName)
    }

    return { navigateTo, routesCatalog: appRoutesCatalog }
  }
)

export { useAppRouter, AppRouterContextProvider }
