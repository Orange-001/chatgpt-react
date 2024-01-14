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
          variant="borderless"
          size="large"
        />
      </div>
      <button className="cursor-pointer b b-#565869 rounded-lg b-solid p-1.2 hover:b-#a7a9bb">
        <i className="i-majesticons:settings-cog text-20px c-[rgba(255,255,255,0.8)]"></i>
      </button>
    </div>
  )
}
