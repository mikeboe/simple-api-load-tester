import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TestProvider } from './context/TestContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <React.StrictMode>
      <TestProvider>
        <App />
      </TestProvider>
    </React.StrictMode>
  </BrowserRouter>,
)
