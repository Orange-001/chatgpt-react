import { Input, InputRef, Tooltip } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'

import IconNewChat from '@/assets/icon/new-chat.svg?react'
import { useMobileScreen } from '@/hooks/useMobileScreen'
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

const NewChat = memo((props: { setCollapse: (collapse: boolean) => void }) => {
  const isMobileScreen = useMobileScreen()
  const NewChatBtnRef = useRef<HTMLDivElement>(null)
  const { setCurrentSessionId } = useChatStore(state => ({
    setCurrentSessionId: state.setCurrentSessionId
  }))

  function handleNewChat() {
    setCurrentSessionId('')
    if (isMobileScreen) {
      props.setCollapse(true)
    }
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
})

function EditSessionTopic(props: {
  id: string
  value: string
  isActive: boolean
  setShowInput: (show: boolean) => void
}) {
  const { id, value, isActive, setShowInput } = props
  const { updateSession } = useChatStore(state => ({
    updateSession: state.updateSession
  }))
  const ref = useRef<InputRef>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <Input
      ref={ref}
      defaultValue={value}
      onChange={e => {
        updateSession(id, { topic: e.currentTarget.value })
      }}
      onPressEnter={() => {
        ref.current?.blur()
      }}
      onBlur={() => {
        setShowInput(false)
      }}
      className={classNames(
        'p-0 c-white hover:bg-#202123 group-hover:bg-#202123 transition-none',
        isActive ? 'bg-#343541!' : 'bg-#000000'
      )}
      variant="borderless"
    />
  )
}

const SessionList = memo(
  (props: { setCollapse: (collapse: boolean) => void }) => {
    const { currentSessionId, sessions, setCurrentSessionId, delSessionById } =
      useChatStore(state => ({
        currentSessionId: state.currentSessionId,
        sessions: state.sessions,
        setCurrentSessionId: state.setCurrentSessionId,
        delSessionById: state.delSessionById
      }))
    const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([])
    const [showInput, setShowInput] = useState(false)
    const [targetId, setTargetId] = useState('')
    const isMobileScreen = useMobileScreen()

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
      if (isMobileScreen) {
        props.setCollapse(true)
      }
    }

    function handleDel(id: string) {
      delSessionById(id)
    }

    function openEdit(id: string) {
      setShowInput(true)
      setTargetId(id)
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
                    const isActive = cItem.id === currentSessionId
                    const isTarget = cItem.id === targetId
                    return (
                      <li
                        key={cItem.id}
                        className={classNames(
                          'group relative cursor-pointer rounded-lg p-2 text-sm hover:bg-#202123 active:opacity-90 animate-name-[slide-in] animate-duration-500 animate-ease',
                          isActive ? 'bg-#343541!' : ''
                        )}
                        onClick={() => handleSelectSession(cItem.id)}
                        onDoubleClick={() => openEdit(cItem.id)}
                      >
                        {showInput && isTarget ? (
                          <EditSessionTopic
                            id={cItem.id}
                            value={cItem.topic}
                            isActive={isActive}
                            setShowInput={setShowInput}
                          />
                        ) : (
                          <>
                            <div className="overflow-hidden whitespace-nowrap">
                              {cItem.topic}
                            </div>
                            <div
                              className={classNames(
                                'w-20 absolute bottom-0 right-0 top-0 hidden justify-end items-center gap-1.5 pr-2 group-hover:flex rounded-lg',
                                isActive ? 'flex' : ''
                              )}
                              style={{
                                backgroundImage: isActive
                                  ? 'linear-gradient(to left, #343541 60%, rgba(255, 255, 255, 0))'
                                  : 'linear-gradient(to left, #202123 60%, rgba(0, 0, 0, 0))'
                              }}
                            >
                              <Tooltip
                                placement="top"
                                title="rename"
                                color="#333333"
                              >
                                <button
                                  onClick={e => {
                                    e.stopPropagation()
                                    openEdit(cItem.id)
                                  }}
                                >
                                  <i className="i-ph:pencil-simple-fill text-18px c-white hover:opacity-70"></i>
                                </button>
                              </Tooltip>
                              <Tooltip
                                placement="top"
                                title="delete"
                                color="#333333"
                              >
                                <button
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleDel(cItem.id)
                                  }}
                                >
                                  <i className="i-material-symbols:delete text-18px c-white hover:opacity-70"></i>
                                </button>
                              </Tooltip>
                            </div>
                          </>
                        )}
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
)

function ToggleCollapseBtn(props: { collapse: boolean; onClick: () => void }) {
  const { collapse, onClick } = props
  const isMobileScreen = useMobileScreen()
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
      <Tooltip
        placement="right"
        title={title}
        mouseLeaveDelay={0}
        open={isMobileScreen ? false : undefined}
      >
        <button className="cursor-pointer" onClick={onClick}>
          <div className="h-[72px] w-8 flex items-center justify-center">
            <div className="h-5.5 w-1 rounded-full bg-#ececf1 opacity-25 transition-colors transition-duration-1000 group-hover:opacity-75"></div>
          </div>
        </button>
      </Tooltip>
    </div>
  )
}

function LayoutSider(props: {
  collapse: boolean
  setCollapse: (collapse: boolean) => void
}) {
  const { collapse, setCollapse } = props
  const handleToggleCollapse = useCallback(() => {
    setCollapse(!collapse)
  }, [collapse, setCollapse])

  const isMobileScreen = useMobileScreen()
  useEffect(() => {
    setCollapse(isMobileScreen)
  }, [isMobileScreen, setCollapse])

  return (
    <>
      <div
        className={classNames(
          'absolute h-full z-10 md:relative bg-black  box-border transition-all transition-duration-400',
          collapse ? 'w-0' : 'w-260px'
        )}
      >
        <div className="h-full overflow-hidden">
          <nav className="box-border h-full overflow-auto px-3 pb-3.5">
            <NewChat setCollapse={setCollapse} />
            <SessionList setCollapse={setCollapse} />
          </nav>
        </div>
        <ToggleCollapseBtn collapse={collapse} onClick={handleToggleCollapse} />
      </div>
      {isMobileScreen && !collapse && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-1 bg-[rgba(0,0,0,0.5)]"
          onClick={() => setCollapse(true)}
        ></div>
      )}
    </>
  )
}
export default LayoutSider
