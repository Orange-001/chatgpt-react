import { Input } from 'antd'
import classNames from 'classnames'

import IconNewChat from '@/assets/icon/new-chat.svg?react'

export function Content() {
  const [input, setInput] = useState('')
  const [done, setDone] = useState(true)
  function onInput(val: string) {
    setInput(val)
  }

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
        <div className="mb-5 text-2xl font-medium">
          How can I help you today?
        </div>
      </div>
    )
  }

  return (
    <div className="m-auto max-w-1200px flex flex-1 flex-col px-16px">
      <div className="flex-1">
        <IconUserAvatar />
        <IconChatGPTAvatar />
        {/* <Empty /> */}
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
