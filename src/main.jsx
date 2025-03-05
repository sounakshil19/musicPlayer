import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MusicProvider } from './Context/MusicProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MusicProvider>
    <App />

    </MusicProvider>
  </StrictMode>,
)
