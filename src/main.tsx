import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

console.log('[Main] Starting application initialization')

window.addEventListener('error', (event) => {
  console.error('[Global Error Handler]', event.error)
  event.preventDefault()
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason)
  event.preventDefault()
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('[Main] Root element not found!')
  document.body.innerHTML = '<div style="color: white; padding: 20px;">Root element not found. Please check index.html</div>'
} else {
  console.log('[Main] Root element found, creating React root')
  
  try {
    const root = createRoot(rootElement)
    console.log('[Main] React root created, rendering app')
    
    root.render(
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error('[ErrorBoundary] Caught error:', error, info)
        }}
        onReset={() => {
          window.location.reload()
        }}
      >
        <App />
      </ErrorBoundary>
    )
    
    console.log('[Main] App rendered successfully')
  } catch (error) {
    console.error('[Main] Failed to render app:', error)
    rootElement.innerHTML = `<div style="color: white; padding: 20px;">Failed to render: ${error instanceof Error ? error.message : 'Unknown error'}</div>`
  }
}
