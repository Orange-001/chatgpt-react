import React, { Suspense } from 'react'

const NewChat = lazy(() => import('@/views/NewChat'))
const Chat = lazy(() => import('@/views/Chat'))

function LayoutContent() {
  return (
    <Suspense>
      <Routes>
        <Route path="/">
          <Route index element={<NewChat />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default LayoutContent
