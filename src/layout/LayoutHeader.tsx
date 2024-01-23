import { Select } from 'antd'
import classNames from 'classnames'
import { ReactNode } from 'react'
import styled from 'styled-components'

import useModelsStore from '@/store/models'

interface ModelGroupItem {
  label: string
  options: {
    label: ReactNode
    value: string
  }[]
}

function LayoutHeader() {
  const { currentModel, setCurrentModel, getModels } = useModelsStore(
    state => ({
      currentModel: state.currentModel,
      setCurrentModel: state.setCurrentModel,
      getModels: state.getModels
    })
  )
  const [models, setModels] = useState<ModelGroupItem[]>([])

  useEffect(() => {
    fetchModels()
  }, [])

  async function fetchModels() {
    try {
      const res = await getModels()
      const temp: ModelGroupItem[] = []
      res.map(v => {
        const index = temp.findIndex(vv => vv.label === v.owned_by)
        if (index === -1) {
          temp.push({
            label: v.owned_by,
            options: [{ label: v.id, value: v.id }]
          })
        } else {
          temp[index].options.push({ label: v.id, value: v.id })
        }
      })
      setModels(temp)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <LayoutHeaderWrapper className="mb-1.5 box-border h-14 flex items-center justify-between p-2 font-semibold">
      <div>
        <Select
          value={currentModel}
          onChange={val => {
            setCurrentModel(val)
          }}
          options={models}
          variant="borderless"
          size="large"
          className="min-w-160px"
          popupClassName="has-[.ant-select-item-empty]:min-w-unset min-w-200px"
        />
      </div>
      <button className="cursor-pointer b b-#565869 rounded-lg b-solid p-1.2 hover:b-#a7a9bb">
        <i className="i-majesticons:settings-cog text-20px c-[rgba(255,255,255,0.8)]"></i>
      </button>
    </LayoutHeaderWrapper>
  )
}

const LayoutHeaderWrapper = styled.div`
  .ant-select {
    .ant-select-selection-item {
      font-size: 18px;
    }
  }
`

export default LayoutHeader
