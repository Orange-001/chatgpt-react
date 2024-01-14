import 'virtual:uno.css'
import '@/assets/style/index.scss'

import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Select: {}
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
