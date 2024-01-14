import { Select } from 'antd'

export function Header() {
  return (
    <div className="mb-1.5 box-border h-14 flex items-center justify-between p-2 font-semibold">
      <div>
        <Select
          defaultValue="lucy"
          style={{ width: 120 }}
          onChange={() => {}}
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true }
          ]}
          bordered={false}
          size="large"
        />
      </div>
    </div>
  )
}
