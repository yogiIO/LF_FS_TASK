import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/frontend/App.jsx'
import ErrorBoundary from './src/frontend/components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
)
