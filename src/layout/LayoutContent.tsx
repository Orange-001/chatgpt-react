import React, { Suspense } from 'react'

const NewChat = lazy(() => import('@/views/NewChat'))
const Chat = lazy(() => import('@/views/Chat'))

function LayoutContent() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<NewChat />} />
        <Route path="/new-chat" element={<NewChat />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      {/* <div>{useRoutes(routes)}</div> */}
    </Suspense>
  )
}

export default LayoutContent
