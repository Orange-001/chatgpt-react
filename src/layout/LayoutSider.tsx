import { Tooltip } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'

import IconNewChat from '@/assets/icon/new-chat.svg?react'
import useChatStore, { Session } from '@/store/chat'
import {
  isToday,
  isWithin7Days,
  isWithin30Days,
  isYesterday
} from '@/utils/date'

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
    sessions.forEach(v => {
      const targetDate = dayjs(v.createTime)

      if (isToday(targetDate)) {
        temp[0].sessions.push(v)
      } else if (isYesterday(targetDate)) {
        temp[1].sessions.push(v)
      } else if (isWithin7Days(targetDate)) {
        temp[2].sessions.push(v)
      } else if (isWithin30Days(targetDate)) {
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

function ToggleCollapseBtn(props: { collapse: boolean; onClick: () => void }) {
  const { collapse, onClick } = props
  const [title, setTitle] = useState('Close siderbar')
  useEffect(() => {
    setTimeout(() => {
      setTitle(collapse ? 'Open siderbar' : 'Close siderbar')
    }, 100)
  }, [collapse])
  return (
    <div
      className="group absolute right--30px top-50%"
      style={{ transform: 'translateY(-50%)' }}
    >
      <Tooltip placement="right" title={title} mouseLeaveDelay={0}>
        <button className="cursor-pointer" onClick={onClick}>
          <div className="h-[72px] w-8 flex items-center justify-center">
            <div className="h-5.5 w-1 rounded-full bg-#ececf1 opacity-25 transition-colors transition-duration-1000 group-hover:opacity-75"></div>
          </div>
        </button>
      </Tooltip>
    </div>
  )
}

function LayoutSider() {
  const [collapse, setCollapse] = useState(false)
  const handleToggleCollapse = useCallback(() => {
    setCollapse(!collapse)
  }, [collapse])

  const NewChatMemo = memo(NewChat)
  const SessionListMemo = memo(SessionList)
  const ToggleCollapseBtnMemo = memo(ToggleCollapseBtn)
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
      <ToggleCollapseBtnMemo
        collapse={collapse}
        onClick={handleToggleCollapse}
      />
    </div>
  )
}
export default LayoutSider
