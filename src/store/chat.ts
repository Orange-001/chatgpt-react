import { nanoid } from '@reduxjs/toolkit'
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
  userSendMessage: (content: string) => void
  getCurrentSession: () => Session | undefined
  delSessionById: (id: string) => void
  getSessionIndexById: (id: string) => number
  getCurrentSessionIndex: (id: string) => number
  clearCurrentSessionId: () => void
  resetCurrentSessionId: () => void
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

          userSendMessage(content: string) {
            set(state => {
              const hasCurrent = state.getCurrentSession()
              if (hasCurrent) {
                console.log('hasCurrent')
              } else {
                const item: Session = {
                  id: nanoid(),
                  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  topic: 'New Chat',
                  messages: [
                    {
                      role: Role.USER,
                      content
                    }
                  ]
                }
                state.sessions.unshift(item)
                state.currentSessionId = state.sessions[0].id
              }
            })
          },

          delSessionById(id: string) {
            set(state => {
              const index = state.getCurrentSessionIndex(id)
              state.sessions.splice(index, 1)
            })
          },

          clearCurrentSessionId() {
            set(state => {
              state.currentSessionId = ''
            })
          },

          resetCurrentSessionId() {
            set(state => {
              const id = state.sessions[0]?.id
              id ? (state.currentSessionId = id) : state.clearCurrentSessionId()
            })
          },

          updateSession(id, session) {
            set(state => {
              const item = state.getSessionById(id)
              item && Object.assign(item, session)
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
