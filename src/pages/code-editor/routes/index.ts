import { AppRoutesCollection } from '../../../global-contexts/app-router/types'

const EmptyComponent = () => {
  return undefined
}

export const codeEditorRoutes = {
  '/project/code': { component: EmptyComponent }
} satisfies AppRoutesCollection
