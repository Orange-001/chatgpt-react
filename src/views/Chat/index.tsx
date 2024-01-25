import { App, Input, Space } from 'antd'
import classNames from 'classnames'
import copy from 'copy-to-clipboard'

import IconNewChat from '@/assets/icon/new-chat.svg?react'
import Markdown from '@/components/Markdown'
import { ChatControllerPool } from '@/controller'
import useChatStore, { Role } from '@/store/chat'
import useModelsStore from '@/store/models'
import useSettingsStore from '@/store/setttings'

// #region Icon
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
// #endregion

// #region Child component
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

function Copy(props: { content: string }) {
  const { message } = App.useApp()

  function handleCopy(content: string) {
    const copyResult = copy(content)
    copyResult
      ? message.success('已复制到剪切板', 1)
      : message.error('复制失败', 1)
  }

  return (
    <i
      className="i-material-symbols:content-copy-outline invisible text-20px c-#acacbe group-hover:visible active:scale-98 hover:c-white"
      onClick={() => handleCopy(props.content)}
    ></i>
  )
}

function Edit() {
  return (
    <i className="i-ri:quill-pen-line invisible text-20px c-#acacbe group-hover:visible active:scale-98 hover:c-white"></i>
  )
}
// #endregion

function Chat() {
  const { message } = App.useApp()
  const { currentModel } = useModelsStore(state => ({
    currentModel: state.currentModel
  }))
  const { settings } = useSettingsStore(state => ({
    settings: state.settings
  }))
  const {
    currentSessionId,
    userSendMessage,
    getCurrentSession,
    updateSession
  } = useChatStore(state => ({
    currentSessionId: state.currentSessionId,
    userSendMessage: state.userSendMessage,
    getCurrentSession: state.getCurrentSession,
    updateSession: state.updateSession
  }))
  const currentSession = getCurrentSession()

  const [input, setInput] = useState('')

  function onInput(val: string) {
    setInput(val)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend()
    }
  }

  function handleSend() {
    if (input) {
      userSendMessage(input, currentModel, settings)
      setInput('')
    } else {
      message.warning('Please Input your message!')
    }
  }

  function handleStop() {
    if (currentSessionId) {
      updateSession(currentSessionId, { streaming: false })
      ChatControllerPool.stop(currentSessionId)
      ChatControllerPool.remove(currentSessionId)
    }
  }

  return (
    <div className="h-0 flex-1 px-16px">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-1.25rem">
          {!currentSession && <Empty />}
          {currentSession?.messages.map((item, index) => {
            const isUser = item.role === Role.USER
            return (
              <div
                key={item.id}
                className="group m-auto animate-name-[slide-in] animate-duration-500 animate-ease gap-6 px-4 py-2 text-base text-#ececf1 lg:max-w-[40rem] md:max-w-3xl xl:max-w-[48rem] lg:px-1 md:px-5 xl:px-5"
              >
                <div className="flex gap-3">
                  <div className="">
                    {isUser ? <IconUserAvatar /> : <IconChatGPTAvatar />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">
                      {isUser ? 'You' : 'Assistant'}
                    </div>
                    <div>
                      <Markdown content={item.content} />
                    </div>
                    <Space size={8}>
                      {!currentSession.streaming && (
                        <Copy content={item.content} />
                      )}
                      {/* {isUser && <Edit />} */}
                    </Space>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="">
          <div className="relative m-auto lg:max-w-[40rem] md:max-w-3xl xl:max-w-[48rem]">
            <Input.TextArea
              placeholder="Message Assistant..."
              className="c-white b-#555561! bg-#343541! py-14px! placeholder:c-#94959b"
              value={input}
              onInput={e => onInput(e.currentTarget.value)}
              onKeyDown={onKeyDown}
              autoSize={{ minRows: 1, maxRows: 8 }}
              autoFocus={true}
              size="large"
            />
            <button
              className="absolute right-10px top-50% rounded-lg p-4px active:opacity-80"
              style={{ transform: 'translateY(-50%)' }}
              onClick={() => {
                currentSession?.streaming ? handleStop() : handleSend()
              }}
            >
              <i
                className={classNames(
                  'c-white active:scale-98',
                  currentSession?.streaming
                    ? 'i-solar:stop-circle-bold-duotone text-22px'
                    : 'i-ri:send-plane-fill'
                )}
              />
            </button>
          </div>
          <div>
            <p className="px-2 py-2 text-center text-xs text-gray-300 md:px-[60px]">
              Assistant can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
