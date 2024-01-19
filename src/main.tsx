import 'virtual:uno.css'
import '@/assets/style/index.scss'

import { ConfigProvider } from 'antd'
import { App as AntdApp } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.tsx'
import store from './redux-store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      components: {
        Select: {}
      }
    }}
  >
    <AntdApp className="h-full">
      <Provider store={store}>
        <App />
      </Provider>
    </AntdApp>
  </ConfigProvider>
)
