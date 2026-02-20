import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PersonaProvider } from './PersonaContext'
import { ConsentProvider } from './ConsentContext'
import { ErrorBoundary } from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Production error tracking integration point
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureException(error, { contexts: { react: errorInfo } });
        }
      }}
    >
      <ConsentProvider>
        <PersonaProvider>
          <App />
        </PersonaProvider>
      </ConsentProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
