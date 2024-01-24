import { InfoCircleOutlined } from '@ant-design/icons'
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
  Slider,
  SliderSingleProps
} from 'antd'
import { ReactNode } from 'react'
import styled from 'styled-components'

import useModelsStore from '@/store/models'
import type { Settings as SettingsType } from '@/store/setttings'
import useSettingsStore from '@/store/setttings'

interface ModelGroupItem {
  label: string
  options: {
    label: ReactNode
    value: string
  }[]
}

type FieldType = SettingsType

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<FormInstance>(null)
  const { settings, setSettings } = useSettingsStore(state => ({
    settings: state.settings,
    setSettings: state.setSettings
  }))
  const [marksCollection, setMarksCollection] = useState<
    Record<string, SliderSingleProps['marks']>
  >({})

  useEffect(() => {
    handleSetMarksCollection(settings)
  }, [settings, isModalOpen])

  function onClcikSettingBtn() {
    setIsModalOpen(true)
  }

  function handleSetMarksCollection(settings: SettingsType) {
    if (!settings) return
    const { temperature, top_p, presence_penalty, frequency_penalty } = settings
    setMarksCollection({
      temperature: { [temperature]: temperature },
      top_p: { [top_p]: top_p },
      presence_penalty: { [presence_penalty]: presence_penalty },
      frequency_penalty: { [frequency_penalty]: frequency_penalty }
    })
  }

  function onValuesChange(_changedValues: any, allValues: SettingsType) {
    handleSetMarksCollection(allValues)
  }

  function handleOk() {
    const values = formRef.current?.getFieldsValue()
    setSettings(values)
    setIsModalOpen(false)
  }

  function handleCancel() {
    setIsModalOpen(false)
    const copy: FieldType = JSON.parse(JSON.stringify(settings))
    formRef.current?.setFieldsValue(copy)
  }

  return (
    <>
      <button
        className="cursor-pointer b b-#565869 rounded-lg b-solid p-1.2 hover:b-#a7a9bb"
        onClick={onClcikSettingBtn}
      >
        <i className="i-majesticons:settings-cog text-20px c-[rgba(255,255,255,0.8)]"></i>
      </button>
      <Modal
        title="Settings"
        maskClosable={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <SettingFormWrapper>
          <Form
            ref={formRef}
            name="basic"
            className="max-h-70vh overflow-y-auto px-8px"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
            initialValues={settings}
            onValuesChange={onValuesChange}
          >
            <Form.Item<FieldType>
              label="接口地址"
              name="url"
              tooltip={{
                title: '接口地址',
                icon: <InfoCircleOutlined />
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="API Key"
              name="apiKey"
              tooltip={{
                title: 'API Key',
                icon: <InfoCircleOutlined />
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="单次回复限制 (max_tokens)"
              name="max_tokens"
              tooltip={{
                title: '单次交互所用的最大 Token 数',
                icon: <InfoCircleOutlined />
              }}
            >
              <InputNumber
                controls={{
                  upIcon: <i className="i-ic:sharp-keyboard-arrow-up" />,
                  downIcon: <i className="i-ic:sharp-keyboard-arrow-down" />
                }}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="随机性 (temperature)"
              name="temperature"
              tooltip={{
                title: '值越大，回复越随机',
                icon: <InfoCircleOutlined />
              }}
            >
              <Slider
                min={0}
                max={1}
                step={0.1}
                marks={marksCollection?.temperature ?? {}}
                tooltip={{ open: false }}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="核采样 (top_p)"
              name="top_p"
              tooltip={{
                title: '与随机性类似，但不要和随机性一起更改',
                icon: <InfoCircleOutlined />
              }}
            >
              <Slider
                min={0}
                max={1}
                step={0.1}
                marks={marksCollection?.top_p ?? {}}
                tooltip={{ open: false }}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="话题新鲜度 (presence_penalty)"
              name="presence_penalty"
              tooltip={{
                title: '值越大，越有可能扩展到新话题',
                icon: <InfoCircleOutlined />
              }}
            >
              <Slider
                min={-2}
                max={2}
                step={0.1}
                marks={marksCollection?.presence_penalty ?? {}}
                tooltip={{ open: false }}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="频率惩罚度 (frequency_penalty)"
              name="frequency_penalty"
              tooltip={{
                title: '值越大，越有可能降低重复字词',
                icon: <InfoCircleOutlined />
              }}
            >
              <Slider
                min={-2}
                max={2}
                step={0.1}
                marks={marksCollection?.frequency_penalty ?? {}}
                tooltip={{ open: false }}
              />
            </Form.Item>
          </Form>
        </SettingFormWrapper>
      </Modal>
    </>
  )
}

const SettingFormWrapper = styled.div`
  .ant-form {
  }
`

function LayoutHeader() {
  const { settings } = useSettingsStore(state => ({
    settings: state.settings
  }))
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
      const res = await getModels(settings)
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
      <Settings />
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
