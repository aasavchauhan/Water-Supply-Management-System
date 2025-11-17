import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DataProvider } from './context/DataContext'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <App />
      <Toaster position="top-right" richColors />
    </DataProvider>
  </StrictMode>,
)
