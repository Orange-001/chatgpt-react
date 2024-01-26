import { message } from 'antd'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { Settings } from './setttings'

export interface Model {
  id: string
  object: string
  created: number
  owned_by: string
}

interface Models {
  currentModel: string
  setCurrentModel: (val: string) => void
  getModels: (settings: Settings) => Promise<Model[]>
}

const useModelsStore = create<Models>()(
  persist(
    immer(
      devtools((set): Models => {
        return {
          currentModel: 'gpt-3.5-turbo',

          async getModels(settings) {
            const { url, apiKey } = settings
            const fetchUrl = `${url}/v1/models`

            try {
              const res = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'x-requested-with': 'XMLHttpRequest',
                  Authorization: `Bearer ${apiKey}`
                }
              })
              const data = await res.json()
              if (res.status === 200) {
                return Promise.resolve(data.data)
              } else {
                if (data?.error?.message) {
                  message.error(data.error.message)
                } else {
                  message.error(`${res.status} ${res.statusText}`)
                }
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
