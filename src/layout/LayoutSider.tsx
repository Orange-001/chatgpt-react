import { Tooltip } from 'antd'
import classNames from 'classnames'

import IconNewChat from '@/assets/icon/new-chat.svg?react'

function NewChat() {
  const NewChatBtnRef = useRef<HTMLDivElement>(null)
  function handleNewChat() {
    console.log('handleNewChat')
  }

  return (
    <div className="sticky top-0 z-10 bg-black pt-3.5">
      <div
        ref={NewChatBtnRef}
        className="h-10 flex cursor-pointer items-center gap-2 rounded-lg px-2 active:scale-98 hover:bg-#202123"
        onClick={handleNewChat}
      >
        <div className="h-28px w-28px flex items-center justify-center rd-50% bg-white">
          <IconNewChat className="h-18px w-18px c-black" />
        </div>
        <div className="text-sm">New chat</div>
      </div>
    </div>
  )
}

function SessionList() {
  const [sessionList, setSessionList] = useState([
    {
      title: 'Today',
      child: [
        {
          title: 'SVG白色背景',
          id: '0'
        }
      ]
    },
    {
      title: 'Yesterday',
      child: [
        {
          title: '使用SCSS变量在UnoCSS',
          id: '1'
        }
      ]
    },
    {
      title: 'Previous 7 Days',
      child: [
        {
          title: 'SWC: Solidity Security Standards',
          id: '2'
        },
        {
          title: 'WebChatGPT',
          id: '3'
        },
        {
          title: 'Vue2响应式漏洞解释Vue2响应式漏洞解释Vue2响应式漏洞解释',
          id: '4'
        }
      ]
    }
  ])
  const [active, setActive] = useState('0')

  function handleSelectSession(id: string) {
    setActive(id)
  }
  function handleRename() {
    console.log('handleRename')
  }
  function handleDel() {
    console.log('handleDel')
  }

  return (
    <div>
      {sessionList.map((item, index) => {
        return (
          <div key={index} className="mt-5">
            <h3 className="h-9 bg-black px-2 pb-2 pt-3 text-xs c-[rgba(102,102,102)] font-medium">
              {item.title}
            </h3>
            <ol>
              {item.child.map(cItem => {
                return (
                  <li
                    key={cItem.id}
                    className={classNames(
                      'group relative cursor-pointer rounded-lg p-2 text-sm hover:bg-#202123 active:opacity-90',
                      active === cItem.id ? 'bg-#343541!' : ''
                    )}
                    onClick={() => handleSelectSession(cItem.id)}
                  >
                    <div className="overflow-hidden whitespace-nowrap">
                      {cItem.title}
                    </div>
                    <div
                      className={classNames(
                        'w-20 absolute bottom-0 right-0 top-0 hidden justify-end items-center gap-1.5 pr-2 group-hover:flex rounded-lg',
                        active === cItem.id ? 'flex' : ''
                      )}
                      style={{
                        backgroundImage:
                          active === cItem.id
                            ? 'linear-gradient(to left, #343541 60%, rgba(255, 255, 255, 0))'
                            : 'linear-gradient(to left, #202123 60%, rgba(0, 0, 0, 0))'
                      }}
                    >
                      <Tooltip placement="top" title="rename" color="#333333">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleRename()
                          }}
                        >
                          <i className="i-material-symbols:edit c-white hover:opacity-70"></i>
                        </button>
                      </Tooltip>
                      <Tooltip placement="top" title="delete" color="#333333">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleDel()
                          }}
                        >
                          <i className="i-material-symbols:delete c-white hover:opacity-70"></i>
                        </button>
                      </Tooltip>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

function LayoutSider() {
  return (
    <div className="w-260px bg-black">
      <nav className="box-border h-full overflow-auto px-3 pb-3.5">
        <NewChat />
        <SessionList />
      </nav>
    </div>
  )
}
export default LayoutSider
