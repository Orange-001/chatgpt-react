import { message } from 'antd'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Model {
  id: string
  object: string
  created: number
  owned_by: string
}

interface Models {
  currentModel: string
  setCurrentModel: (val: string) => void
  getModels: () => Promise<Model[]>
}

const useModelsStore = create<Models>()(
  persist(
    immer(
      devtools((set, get, api): Models => {
        return {
          currentModel: 'gpt-3.5-turbo',

          async getModels() {
            const { VITE_OPENAI_URL, VITE_OPENAI_KEY } = import.meta.env
            const fetchUrl = `${VITE_OPENAI_URL}/v1/models`

            try {
              const res = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'x-requested-with': 'XMLHttpRequest',
                  Authorization: `Bearer ${VITE_OPENAI_KEY}`
                }
              })
              if (res.status === 200) {
                const data = await res.json()
                return Promise.resolve(data.data)
              } else {
                message.error(`${res.status} ${res.statusText}`)
                return Promise.reject(res)
              }
            } catch (error: any) {
              if (error.message) {
                message.error(error.message)
              } else {
                message.error('Something wrong')
              }
              return Promise.reject(error)
            }
          },

          setCurrentModel(val) {
            set(state => {
              state.currentModel = val
            })
          }
        }
      })
    ),
    { name: 'models' }
  )
)

export default useModelsStore
