import { Tooltip } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'

import IconNewChat from '@/assets/icon/new-chat.svg?react'
import useChatStore, { Session } from '@/store/chat'

interface SessionGroup {
  title: string
  sessions: Session[]
}

function NewChat() {
  const NewChatBtnRef = useRef<HTMLDivElement>(null)
  const { setCurrentSessionId } = useChatStore(state => ({
    setCurrentSessionId: state.setCurrentSessionId
  }))

  function handleNewChat() {
    setCurrentSessionId('')
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
        <div className="overflow-hidden whitespace-nowrap text-sm">
          New chat
        </div>
      </div>
    </div>
  )
}

function SessionList() {
  const { currentSessionId, sessions, setCurrentSessionId, delSessionById } =
    useChatStore(state => ({
      currentSessionId: state.currentSessionId,
      sessions: state.sessions,
      setCurrentSessionId: state.setCurrentSessionId,
      delSessionById: state.delSessionById
    }))
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([])

  useEffect(() => {
    const temp: SessionGroup[] = [
      { title: 'Today', sessions: [] },
      { title: 'Yesterday', sessions: [] },
      { title: 'Previous 7 Days', sessions: [] },
      { title: 'Previous 30 Days', sessions: [] }
    ]
    sessions.map(v => {
      const targetDate = dayjs(v.createTime)
      // 判断是否是今天
      const isToday = dayjs().isSame(targetDate, 'day')
      // 判断是否是昨天
      const isYesterday = dayjs().subtract(1, 'day').isSame(targetDate, 'day')
      // 判断是否是7天前
      const is7DaysAgo = dayjs().subtract(7, 'day').isAfter(targetDate)
      // 判断是否是30天前
      const is30DaysAgo = dayjs().subtract(30, 'day').isAfter(targetDate)

      if (isToday) {
        temp[0].sessions.push(v)
      } else if (isYesterday) {
        temp[1].sessions.push(v)
      } else if (is7DaysAgo) {
        temp[2].sessions.push(v)
      } else if (is30DaysAgo) {
        temp[3].sessions.push(v)
      }
    })
    setSessionGroups(temp)
  }, [sessions])

  function handleSelectSession(id: string) {
    setCurrentSessionId(id)
  }

  function handleRename() {
    console.log('handleRename')
  }

  function handleDel(id: string) {
    delSessionById(id)
  }

  return (
    <div>
      {sessionGroups.map((item, index) => {
        return (
          !!item.sessions.length && (
            <div key={index} className="mt-5">
              <h3 className="h-9 bg-black px-2 pb-2 pt-3 text-xs c-[rgba(102,102,102)] font-medium">
                {item.title}
              </h3>
              <ol>
                {item.sessions.map(cItem => {
                  return (
                    <li
                      key={cItem.id}
                      className={classNames(
                        'group relative cursor-pointer rounded-lg p-2 text-sm hover:bg-#202123 active:opacity-90',
                        currentSessionId === cItem.id ? 'bg-#343541!' : ''
                      )}
                      onClick={() => handleSelectSession(cItem.id)}
                    >
                      <div className="overflow-hidden whitespace-nowrap">
                        {cItem.topic}
                      </div>
                      <div
                        className={classNames(
                          'w-20 absolute bottom-0 right-0 top-0 hidden justify-end items-center gap-1.5 pr-2 group-hover:flex rounded-lg',
                          currentSessionId === cItem.id ? 'flex' : ''
                        )}
                        style={{
                          backgroundImage:
                            currentSessionId === cItem.id
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
                              handleDel(cItem.id)
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
        )
      })}
    </div>
  )
}

function LayoutSider() {
  const [collapse, setCollapse] = useState(false)
  function handleToggleCollapse() {
    setCollapse(!collapse)
  }

  const NewChatMemo = memo(NewChat)
  const SessionListMemo = memo(SessionList)
  return (
    <div
      className={classNames(
        'relative bg-black  box-border transition-all transition-duration-400',
        collapse ? 'w-0' : 'w-260px'
      )}
    >
      <div className="h-full overflow-hidden">
        <nav className="box-border h-full overflow-auto px-3 pb-3.5">
          <NewChatMemo />
          <SessionListMemo />
        </nav>
      </div>
      <i
        className="i-clarity:collapse-line absolute right--20px top-50%"
        style={{ transform: 'translateY(-50%) roate(-90deg)' }}
        onClick={handleToggleCollapse}
      ></i>
    </div>
  )
}
export default LayoutSider
