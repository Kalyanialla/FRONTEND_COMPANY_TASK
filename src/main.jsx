


import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { AuthProvider } from './accounts/Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  // REMOVED StrictMode
  <AuthProvider>
    <App />
  </AuthProvider>
)