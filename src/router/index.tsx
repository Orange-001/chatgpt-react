/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import Layout from '@/layout/Layout'
import ErrorPage from '@/views/ErrorPage'
import NotFound from '@/views/ErrorPage/404'

import guard from './loader/guard'

const NewChat = lazy(() => import('@/views/NewChat'))
const Chat = lazy(() => import('@/views/Chat'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: guard,
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

const router = createBrowserRouter(routes)

export default router
