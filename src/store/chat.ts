import { fetchEventSource } from '@fortaine/fetch-event-source'
import { nanoid } from '@reduxjs/toolkit'
import { message } from 'antd'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { DEFAULT_TOPIC, SUMMARIZE_MIN_LEN } from '@/const'
import { ChatControllerPool } from '@/controller'
import { countMessagesToken } from '@/utils/token'

import { Settings } from './setttings'

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

export interface Message {
  id: string
  role: Role
  content: string
}

export interface Session {
  id: string
  topic: string
  createTime: string
  messages: Message[]
  streaming: boolean
}

interface Chat {
  currentSessionId: string
  sessions: Session[]
  setCurrentSessionId: (id: string) => void
  summarizeSession: (id: string, settings: Settings) => void
  updateSession: (id: string, session: Partial<Session>) => void
  getSessionById: (id: string) => Session | undefined
  userSendMessage: (
    content: string,
    currentModel: string,
    settings: Settings
  ) => void
  getCurrentSession: () => Session | undefined
  delSessionById: (id: string) => void
  getSessionIndexById: (id: string) => number
  getCurrentSessionIndex: () => number
  fetchAnswer: (currentModel: string, settings: Settings) => void
}

const useChatStore = create<Chat>()(
  persist(
    immer(
      devtools((set, get): Chat => {
        return {
          currentSessionId: '',
          sessions: [],

          getSessionIndexById(id) {
            const index = get().sessions.findIndex(v => v.id === id)
            return index
          },

          getCurrentSessionIndex() {
            const index = get().getSessionIndexById(get().currentSessionId)
            return index
          },

          getSessionById(id) {
            const item = get().sessions.find(v => v.id === id)
            return item
          },

          getCurrentSession() {
            const item = get().sessions.find(
              v => v.id === get().currentSessionId
            )
            return item
          },

          setCurrentSessionId(index) {
            set(state => {
              state.currentSessionId = index
            })
          },

          async userSendMessage(content, currentModel, settings) {
            if (get().getCurrentSession()) {
              set(state => {
                state.sessions.forEach(v => {
                  if (v.id === state.currentSessionId) {
                    v.messages.push({
                      id: nanoid(),
                      role: Role.USER,
                      content
                    })
                  }
                })
              })
            } else {
              set(state => {
                state.sessions.unshift({
                  id: nanoid(),
                  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  topic: DEFAULT_TOPIC,
                  messages: [
                    {
                      id: nanoid(),
                      role: Role.USER,
                      content
                    }
                  ],
                  streaming: false
                })
              })
              set(state => {
                state.currentSessionId = get().sessions[0].id
              })
            }

            get().fetchAnswer(currentModel, settings)
          },

          fetchAnswer(currentModel, settings) {
            const currentSession = get().getCurrentSession()
            const currentSessionId = get().currentSessionId
            const currentSessionIndex = get().getCurrentSessionIndex()
            if (!currentSession) return

            const controller = new AbortController()
            const { url, apiKey } = settings
            const fetchUrl = `${url}/v1/chat/completions`

            ChatControllerPool.addController(currentSessionId, controller)

            get().updateSession(currentSessionId, { streaming: true })

            const messages = currentSession.messages.map(item => ({
              role: item.role,
              content: item.content
            }))
            fetchEventSource(fetchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-requested-with': 'XMLHttpRequest',
                Authorization: `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                model: currentModel,
                messages,
                stream: true,
                ...omit(settings, ['url', 'apiKey'])
              }),
              signal: controller.signal,
              onmessage(msg) {
                try {
                  if (msg.data === '[DONE]') {
                    if (currentSessionId) {
                      get().updateSession(currentSessionId, {
                        streaming: false
                      })
                      ChatControllerPool.remove(currentSessionId)
                      get().summarizeSession(currentSessionId, settings)
                    }
                    return
                  }

                  const data = JSON.parse(msg.data)
                  const delta = data.choices[0]?.delta?.content
                  if (delta) {
                    const index =
                      currentSession.messages.at(-1)?.role === Role.ASSISTANT
                        ? currentSession.messages.length - 1
                        : currentSession.messages.length
                    set(state => {
                      const session = state.getSessionById(currentSessionId)
                      if (!session) return
                      const latestMessage =
                        state.sessions[currentSessionIndex].messages[index]
                      if (latestMessage) {
                        state.sessions[currentSessionIndex].messages[
                          index
                        ].content += delta
                      } else {
                        state.sessions[currentSessionIndex].messages[index] = {
                          id: nanoid(),
                          role: Role.ASSISTANT,
                          content: delta
                        }
                      }
                    })
                  }
                } catch (error) {
                  console.log(error)
                  get().updateSession(currentSessionId, { streaming: false })
                  ChatControllerPool.remove(currentSessionId)
                  message.error('Parse error')
                }
              },
              onerror(err) {
                console.log(err)
                get().updateSession(currentSessionId, { streaming: false })
                ChatControllerPool.remove(currentSessionId)
                message.error(`something wrong ${err}`)
                // no retry
                throw err
              }
            })
          },

          delSessionById(id: string) {
            set(state => {
              const index = state.getSessionIndexById(id)
              state.sessions.splice(index, 1)
              if (!state.sessions.length) {
                state.currentSessionId = ''
              } else if (id === state.currentSessionId) {
                state.currentSessionId = state.sessions[0].id
              }
            })
          },

          updateSession(id, session) {
            set(state => {
              state.sessions.forEach(item => {
                if (item.id === id) {
                  Object.assign(item, session)
                }
              })
            })
          },

          async summarizeSession(id, settings) {
            const session = this.getSessionById(id)

            if (
              session &&
              session.topic === DEFAULT_TOPIC &&
              countMessagesToken(session.messages) >= SUMMARIZE_MIN_LEN
            ) {
              const { url, apiKey } = settings
              const fetchUrl = `${url}/v1/chat/completions`
              const messages = session.messages
                .map(item => ({
                  role: item.role,
                  content: item.content
                }))
                .concat({
                  role: Role.USER,
                  content:
                    'Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.'
                })

              try {
                const res = await fetch(fetchUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-requested-with': 'XMLHttpRequest',
                    Authorization: `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages
                  })
                })
                if (res.status === 200) {
                  const data = await res.json()
                  const topic = data.choices[0].message.content
                  get().updateSession(id, { topic })
                } else {
                  message.error(`${res.status} ${res.statusText}`)
                  console.log(res)
                }
              } catch (error: any) {
                if (error.message) {
                  message.error(error.message)
                } else {
                  message.error('Something wrong')
                }
              }
            }
          }
        }
      })
    ),
    { name: 'chatStore' }
  )
)

export default useChatStore
