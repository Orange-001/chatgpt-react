import { App, Input } from 'antd'
import classNames from 'classnames'

import IconNewChat from '@/assets/icon/new-chat.svg?react'
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
  const { userSendMessage, getCurrentSession } = useChatStore(state => ({
    userSendMessage: state.userSendMessage,
    getCurrentSession: state.getCurrentSession
  }))
  const currentSession = getCurrentSession()

  const [input, setInput] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  function onInput(val: string) {
    setInput(val)
  }

  const { message } = App.useApp()

  function handleSend() {
    if (input) {
      userSendMessage(input)
    } else {
      message.warning('Please Input your message!')
    }
  }

  function handleStop() {}

  return (
    <div className="m-auto h-0 max-w-1200px flex flex-1 flex-col px-16px">
      <div className="flex-1 overflow-auto">
        {!currentSession && <Empty />}
        {currentSession?.messages.map((item, index) => {
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
                  <div>
                    {item.content}
                    {!isUser &&
                      index === currentSession.messages.length - 1 &&
                      isFetching && (
                        <i className="i-svg-spinners:bars-fade text-20px" />
                      )}
                  </div>
                  <div className="">
                    {isUser && (
                      <i className="i-ic:twotone-edit invisible c-#acacbe group-hover:visible active:scale-98 hover:c-white"></i>
                    )}
                    {!isUser && !isFetching && (
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
              isFetching ? handleStop() : handleSend()
            }}
          >
            <i
              className={classNames(
                'c-white active:scale-98',
                isFetching
                  ? 'i-solar:stop-circle-bold-duotone text-22px'
                  : 'i-ri:send-plane-fill'
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
