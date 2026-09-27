import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/wght.css'
import './styles/index.css'
import './styles/pdp.css'
import './styles/store.css'
import './styles/vitrine.css'
import { App } from './App'
import { loadConfig } from './config'
import { enableSmoothWheel } from './lib/smoothScroll'

enableSmoothWheel()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={loadConfig()} />
  </StrictMode>,
)
