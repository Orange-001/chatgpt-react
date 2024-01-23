import { fetchEventSource } from '@fortaine/fetch-event-source'
import { nanoid } from '@reduxjs/toolkit'
import { message } from 'antd'
import dayjs from 'dayjs'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

export interface Message {
  role: Role
  content: string
}

export interface Session {
  id: string
  topic: string
  createTime: string
  messages: Message[]
}

interface Chat {
  currentSessionId: string
  sessions: Session[]
  setCurrentSessionId: (id: string) => void
  summarizeSession: (messages: Message[]) => void
  updateSession: (id: string, session: Partial<Session>) => void
  getSessionById: (id: string) => Session | undefined
  userSendMessage: (content: string, currentModel: string) => void
  getCurrentSession: () => Session | undefined
  delSessionById: (id: string) => void
  getSessionIndexById: (id: string) => number
  getCurrentSessionIndex: () => number
  fetchAnswer: (currentModel: string) => void
}

const useChatStore = create<Chat>()(
  persist(
    immer(
      devtools((set, get, api): Chat => {
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

          async userSendMessage(content, currentModel) {
            if (get().getCurrentSession()) {
              set(state => {
                state.sessions.forEach(v => {
                  if (v.id === state.currentSessionId) {
                    v.messages.push({
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
                  topic: 'New Chat',
                  messages: [
                    {
                      role: Role.USER,
                      content
                    }
                  ]
                })
              })
              set(state => {
                state.currentSessionId = get().sessions[0].id
              })
            }

            get().fetchAnswer(currentModel)
          },

          fetchAnswer(currentModel) {
            const currentSession = get().getCurrentSession()
            if (!currentSession) return

            const controller = new AbortController()
            const { VITE_OPENAI_URL, VITE_OPENAI_KEY } = import.meta.env
            const fetchUrl = `${VITE_OPENAI_URL}/v1/chat/completions`

            fetchEventSource(fetchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-requested-with': 'XMLHttpRequest',
                Authorization: `Bearer ${VITE_OPENAI_KEY}`
              },
              body: JSON.stringify({
                model: currentModel,
                messages: currentSession.messages,
                stream: true,
                temperature: 0.5,
                top_p: 1,
                presence_penalty: 0,
                frequency_penalty: 0
              }),
              signal: controller.signal,
              onmessage(msg) {
                try {
                  if (msg.data === '[DONE]') {
                    return
                  }
                  const data = JSON.parse(msg.data)
                  const delta = data.choices[0]?.delta?.content
                  if (delta) {
                    const current = get().getCurrentSession()
                    const currentSessionIndex = get().getCurrentSessionIndex()
                    if (current && current.id === currentSession.id) {
                      const index =
                        current.messages.at(-1)?.role === Role.ASSISTANT
                          ? current.messages.length - 1
                          : current.messages.length
                      set(state => {
                        state.sessions[currentSessionIndex].messages[index] = {
                          role: Role.ASSISTANT,
                          content:
                            (get().getCurrentSession()?.messages[index]
                              ?.content ?? '') + delta
                        }
                      })
                    }
                  }
                } catch (error) {
                  message.error('Parse error')
                }
              },
              onerror(err) {
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

          async summarizeSession(messages) {
            // const session =
            // const messages = session.message
            const { VITE_OPENAI_URL, VITE_OPENAI_KEY } = import.meta.env
            const fetchUrl = `${VITE_OPENAI_URL}/v1/chat/completions`

            const res = await fetch(fetchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-requested-with': 'XMLHttpRequest',
                Authorization: `Bearer ${VITE_OPENAI_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                  ...messages,
                  {
                    role: 'user',
                    content:
                      'Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.'
                  }
                ]
              })
            })
            if (res.status === 200) {
              const data = res.json()
              console.log(res)
              console.log(data)
            } else {
              console.log(res)
            }
          }
        }
      })
    ),
    { name: 'chatStore' }
  )
)

export default useChatStore
