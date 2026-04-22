import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// In dev mode, unregister any lingering service workers (e.g. from a previous
// `npm run preview` at the same port) so Vite's HMR is never intercepted.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister())
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
