import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Settings {
  url: string
  apiKey: string
  temperature: number
  top_p: number
  presence_penalty: number
  frequency_penalty: number
}

interface SettingsStore {
  settings: Settings
  setSettings: (settings: Settings) => void
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    immer(
      devtools((set): SettingsStore => {
        const { VITE_OPENAI_URL, VITE_OPENAI_KEY } = import.meta.env
        return {
          settings: {
            url: VITE_OPENAI_URL,
            apiKey: VITE_OPENAI_KEY,
            temperature: 0.4,
            top_p: 1,
            presence_penalty: 0,
            frequency_penalty: 0
          },

          setSettings(settings) {
            set(state => {
              state.settings = settings
            })
          }
        }
      })
    ),
    { name: 'settings' }
  )
)

export default useSettingsStore
