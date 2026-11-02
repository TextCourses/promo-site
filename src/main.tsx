import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MotionPolicyProvider } from './components/motion'
// Tailwind utility-классы (preflight + utilities). Без этого импорта
// PostCSS не запускается на @tailwind-директивах → лендинг остаётся
// без стилей (только tokens.css через <link> в index.html).
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionPolicyProvider>
      <App />
    </MotionPolicyProvider>
  </React.StrictMode>,
)
