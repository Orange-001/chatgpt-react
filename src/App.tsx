import { RouterProvider } from 'react-router-dom'

// import { Content } from './components/Content'
// import { Header } from './components/Header'
// import { SiderBar } from './components/Siderbar'
import router from './router'

const App: React.FC = () => {
  return (
    // <div className="h-full flex c-white">
    //   <SiderBar />
    //   <div className="flex flex-1 flex-col bg-#343541">
    //     <Header />
    //     <Content />
    //   </div>
    // </div>
    <RouterProvider router={router} />
  )
}

export default App
