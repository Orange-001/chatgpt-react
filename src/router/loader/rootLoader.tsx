import type { LoaderFunction } from 'react-router-dom'
import { redirect } from 'react-router-dom'
// Loaders run before the next route is rendered and history is updated, so checking window.location won;'t be accurate.
// You want to check the location the loader is executing for via the request.
const rootLoader: LoaderFunction = ({ request }) => {
  const isAuth = true
  console.log(request)

  if (isAuth && new URL(request.url).pathname === '/chat') {
    return redirect('/')
  }
  return null
}

export default rootLoader
