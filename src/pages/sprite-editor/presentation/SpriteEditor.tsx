import { SpriteEditorContextProvider } from '../context'
import { SpriteEditorCanvas } from './partials/SpriteEditorCanvas'
import { SpriteEditorTools } from './partials/widgets/SpriteEditorTools'
import { SpriteEditorPalette } from './partials/widgets/SpriteEditorPalette'
import { SpriteEditorHistory } from './partials/widgets/SpriteEditorHistory'
import styled from 'styled-components'
import { SpriteEditorNavigator } from './partials/widgets/navigator/SpriteEditorNavigator'
import { SpriteEditorInfo } from './partials/widgets/SpriteEditorInfo'


const SpriteEditorLayout = styled.div` 
  display: grid;
  grid-template-columns: 50px 500px 200px;
  grid-template-rows:600px;
  gap: 20px;
  padding: 20px;
  * {
    user-select: none; 
  }
`

const Sidebar = styled.div` 
  display: grid;
  grid-template-columns: 100%;
  place-content: start;
  gap: 20px;
`

export const SpriteEditor = () => {
  return (
    <>
      <SpriteEditorContextProvider >
        <SpriteEditorLayout>
          <SpriteEditorTools />
          <SpriteEditorCanvas />
          <Sidebar>
            <SpriteEditorInfo />
            <SpriteEditorNavigator />
            <SpriteEditorPalette />
            <SpriteEditorHistory />
          </Sidebar>
        </SpriteEditorLayout>
      </SpriteEditorContextProvider >
    </>
  )
}

