import React, { Suspense } from 'react'

function LayoutContent() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  )
}

export default LayoutContent
