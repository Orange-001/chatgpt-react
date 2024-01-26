import { useMobileScreen } from '@/hooks/useMobileScreen'

import LayoutContent from './LayoutContent'
import LayoutHeader from './LayoutHeader'
import LayoutSider from './LayoutSider'

function Layout() {
  const isMobileScreen = useMobileScreen()
  const [collapse, setCollapse] = useState(isMobileScreen)

  return (
    <div className="h-full flex c-white">
      <LayoutSider collapse={collapse} setCollapse={setCollapse} />
      <div className="flex flex-1 flex-col bg-#343541">
        <LayoutHeader setCollapse={setCollapse} />
        <LayoutContent />
      </div>
    </div>
  )
}

export default Layout
