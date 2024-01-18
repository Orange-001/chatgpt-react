import { LoaderFunction, redirect } from 'react-router-dom'

export const guard: LoaderFunction = ({ request, params }) => {
  // return redirect('/')
  console.log(request, params)
  return null
}
