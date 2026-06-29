import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ArchiveDataProvider } from './data/archiveClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArchiveDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ArchiveDataProvider>
  </StrictMode>,
)
