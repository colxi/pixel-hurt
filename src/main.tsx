import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'

import { configureSingle } from '@zenfs/core'
import { IndexedDB } from '@zenfs/dom'

console.log('[INFO]: Initializing app')
// initialize local filesystem
await configureSingle({ backend: IndexedDB })



ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
)
