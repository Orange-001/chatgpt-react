import { LoaderFunction } from 'react-router-dom'

const guard: LoaderFunction = () => {
  // console.log(location)
  // console.log(request, params, context)
  // const { pathname } = location
  // if (pathname === '/chat') {
  //   return redirect('/new-chat')
  // }
  return null
}

export default guard
