import LayoutContent from './LayoutContent'
import LayoutHeader from './LayoutHeader'
import LayoutSider from './LayoutSider'

function Layout() {
  return (
    <div className="h-full flex c-white">
      <LayoutSider />
      <div className="flex flex-1 flex-col bg-#343541">
        <LayoutHeader />
        <LayoutContent />
      </div>
    </div>
  )
}

export default Layout
