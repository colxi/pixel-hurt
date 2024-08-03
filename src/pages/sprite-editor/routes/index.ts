import { AppRoutesCollection } from '../../../global-contexts/app-router/types'
import { SpriteEditor } from '../presentation/SpriteEditor'

export const spritesEditorRoutes = {
  '/project/sprites': { component: SpriteEditor }
} satisfies AppRoutesCollection
