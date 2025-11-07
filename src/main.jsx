import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Importar utilitários de debug (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  import('./utils/apiDebug.js')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

