/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import Layout from '@/layout/Layout'
import ErrorPage from '@/views/ErrorPage'
import NotFound from '@/views/ErrorPage/404'

import rootLoader from './loader/rootLoader'

const NewChat = lazy(() => import('@/views/NewChat'))
const Chat = lazy(() => import('@/views/Chat'))

export const router: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <NewChat />
      },
      {
        path: '/chat',
        element: <Chat />
      }
    ]
  },
  {
    path: '/*',
    element: <NotFound />
  }
]

const browserRouter = createBrowserRouter(router)

export default browserRouter
