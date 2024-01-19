import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface Message {
  role: string
  content: string
  date: string
}

export interface Session {
  topic: string
  messages: Message[]
}

interface Chat {
  currentSessionIndex: number
  sessions: Session[]
}

const initialState: Chat = {
  currentSessionIndex: 0,
  sessions: []
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    del(state, action: PayloadAction) {
      console.log(state, action)
    }
  }
})

export const { del } = chatSlice.actions
export default chatSlice.reducer
