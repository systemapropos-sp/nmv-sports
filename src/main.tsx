import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'
import App from './App.tsx'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silent fail
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </HashRouter>,
)
