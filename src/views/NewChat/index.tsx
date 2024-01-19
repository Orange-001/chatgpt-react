import { fetchEventSource } from '@fortaine/fetch-event-source'
import { App, Input } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useShallow } from 'zustand/react/shallow'

import IconNewChat from '@/assets/icon/new-chat.svg?react'
import type { Message } from '@/store/chat'
import useChatStore, { Role } from '@/store/chat'

// #region Icon & Empty
function IconUserAvatar() {
  return (
    <div className="h-24px w-24px flex items-center justify-center rd-50% bg-#2dc2d8">
      <i className="i-fluent:animal-cat-16-regular cursor-unset text-19px"></i>
    </div>
  )
}

function IconChatGPTAvatar() {
  return (
    <div className="h-24px w-24px flex items-center justify-center rd-50% bg-#19c37d">
      <IconNewChat className="w-18px c-white" />
    </div>
  )
}

function Empty() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 h-72px w-72px flex items-center justify-center rd-50% bg-white">
        <IconNewChat className="w-41px c-black" />
      </div>
      <div className="mb-5 text-2xl font-medium">How can I help you today?</div>
    </div>
  )
}
// #endregion

function Chat() {
  const { currentSessionId, sessions, newSession } = useChatStore(
    useShallow(state => ({
      currentSessionId: state.currentSessionId,
      sessions: state.sessions,
      newSession: state.newSession
    }))
  )

  const [input, setInput] = useState('')
  const [done, setDone] = useState(true)

  function onInput(val: string) {
    setInput(val)
  }

  const [history, setHistory] = useState<Message[]>([])
  const { VITE_OPENAI_URL, VITE_OPENAI_KEY, VITE_MAX_SEND_MES_COUNT } =
    import.meta.env
  const fetchUrl = `${VITE_OPENAI_URL}/v1/chat/completions`
  const { message } = App.useApp()

  function handleSend() {
    if (input) {
      const controller = new AbortController()
      const userMsg: Message = {
        role: Role.USER,
        content: input
      }
      const historyTemp = [...history, userMsg]
      newSession(historyTemp)
      return
      setHistory(historyTemp)
      const data = {
        model: 'gpt-3.5-turbo',
        messages: historyTemp.slice(-VITE_MAX_SEND_MES_COUNT),
        stream: true
      }
      let remainText = ''

      setDone(false)
      fetchEventSource(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest',
          Authorization: `Bearer ${VITE_OPENAI_KEY}`
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        onmessage(msg) {
          if (msg.data === '[DONE]') {
            setDone(true)
            return
          }
          const text = msg.data
          try {
            const json = JSON.parse(text) as {
              choices: Array<{
                delta: {
                  content: string
                }
              }>
            }
            const delta = json.choices[0]?.delta?.content
            if (delta) {
              remainText += delta
              const historyTempCopy: Message[] = JSON.parse(
                JSON.stringify(historyTemp)
              )
              const index =
                historyTempCopy.at(-1)?.role === Role.ASSISTANT
                  ? historyTempCopy.length - 1
                  : historyTempCopy.length
              historyTempCopy[index] = {
                role: Role.ASSISTANT,
                content: remainText
              }
              setHistory(historyTempCopy)
            }
          } catch (error) {
            console.log('[Request] parse error', text)
          }
        }
      })
    } else {
      setDone(true)
      message.warning('Please Input your message!')
    }
  }

  function handleStop() {}

  return (
    <div className="m-auto h-0 max-w-1200px flex flex-1 flex-col px-16px">
      <div className="flex-1 overflow-auto">
        {/* <IconUserAvatar /> */}
        {/* <IconChatGPTAvatar /> */}
        {history.length === 0 && <Empty />}
        {history.map((item, index) => {
          const isUser = item.role === Role.USER
          return (
            <div
              key={index}
              className="group gap-6 px-4 py-2 text-base text-#ececf1"
            >
              <div className="flex gap-3">
                <div className="">
                  {isUser ? <IconUserAvatar /> : <IconChatGPTAvatar />}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{isUser ? 'You' : 'ChatGPT'}</div>
                  <div>{item.content}</div>
                  <div className="">
                    {isUser && (
                      <i className="i-ic:twotone-edit invisible c-#acacbe group-hover:visible active:scale-98 hover:c-white"></i>
                    )}
                    {!isUser && done && (
                      <i className="i-mingcute:clipboard-line invisible c-#acacbe group-hover:visible active:scale-98 hover:c-white"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="">
        <div className="relative">
          <Input.TextArea
            placeholder="Message ChatGPT..."
            className="c-white b-#555561! bg-#343541! placeholder:c-#94959b"
            value={input}
            onInput={e => onInput(e.currentTarget.value)}
            autoSize={{ minRows: 1, maxRows: 8 }}
            autoFocus={true}
            size="large"
          />
          <button
            className="absolute right-10px top-50% rounded-lg p-4px active:opacity-80"
            style={{ transform: 'translateY(-50%)' }}
            onClick={() => {
              done ? handleSend() : handleStop()
            }}
          >
            <i
              className={classNames(
                'c-white active:scale-98',
                done
                  ? 'i-ri:send-plane-fill'
                  : 'i-solar:stop-circle-bold-duotone text-22px'
              )}
            />
          </button>
        </div>
        <div>
          <p className="px-2 py-2 text-center text-xs text-gray-300 md:px-[60px]">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Chat
