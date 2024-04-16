import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AlphabetSoup } from './components/alphabet-soup'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster
      toastOptions={{
        classNames: {
          error: 'toast-error',
          success: 'toast-success'
        },
      }}
    />
    <AlphabetSoup />
  </React.StrictMode>,
)
