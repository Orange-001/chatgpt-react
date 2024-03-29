import { App, Modal } from 'antd'
import copy from 'copy-to-clipboard'
import mermaid from 'mermaid'
import React, {
  FC,
  memo,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import ReactMarkdown from 'react-markdown'
import RehypeHighlight from 'rehype-highlight'
import RehypeKatex from 'rehype-katex'
import RemarkBreaks from 'remark-breaks'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'
import { useDebouncedCallback } from 'use-debounce'

export const Mermaid: FC<{ code: string }> = props => {
  const ref = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true
        })
        .catch(e => {
          setHasError(true)
          console.error('[Mermaid] ', e.message)
        })
    }
  })

  if (hasError) return null

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector('svg')
    if (!svg) return
    const text = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([text], { type: 'image/svg+xml' })
    setImgSrc(URL.createObjectURL(blob))
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        className="no-dark mermaid cursor-pointer overflow-auto"
        ref={ref}
        onClick={() => {
          viewSvgInNewWindow()
        }}
      >
        {props.code}
      </div>
      <Modal
        title={<div className="c-white">长按或右键保存图片</div>}
        classNames={{
          content: 'bg-[rgb(52,53,65)]!',
          header: 'bg-[rgb(52,53,65)]!',
          body: 'overflow-auto max-h-65vh'
        }}
        open={isModalOpen}
        footer={null}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <img src={imgSrc} alt="preview" className="max-w-full" />
      </Modal>
    </>
  )
}

function PreCode(props: { children: ReactNode }) {
  const { message } = App.useApp()
  const ref = useRef<HTMLPreElement>(null)
  const [mermaidCode, setMermaidCode] = useState('')

  const renderMermaid = useDebouncedCallback(() => {
    if (!ref.current) return
    const mermaidDom = ref.current.querySelector('code.language-mermaid')
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText)
    } else {
      setMermaidCode('')
    }
  }, 50)

  useEffect(() => {
    setTimeout(renderMermaid, 1)
  }, [props.children, renderMermaid])

  return (
    <>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              const code = ref.current.innerText
              const copyResult = copy(code)
              copyResult
                ? message.success('已复制到剪切板', 1)
                : message.error('复制失败', 1)
            }
          }}
        ></span>
        {props.children}
      </pre>
    </>
  )
}

// dollar sign conflict with latex math
function escapeDollarNumber(text: string) {
  let escapedText = ''

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i]
    const nextChar = text[i + 1] || ' '

    if (char === '$' && nextChar >= '0' && nextChar <= '9') {
      char = '\\$'
    }

    escapedText += char
  }

  return escapedText
}

export const MarkdownContent: FC<{ content: string }> = memo(props => {
  const escapedContent = useMemo(
    () => escapeDollarNumber(props.content),
    [props.content]
  )

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[RehypeKatex, [RehypeHighlight, { detect: false }]]}
      components={{
        pre: PreCode as any,
        p: pProps => <p {...pProps} dir="auto" />,
        a: aProps => {
          const href = aProps.href || ''
          const isInternal = /^\/#/i.test(href)
          const target = isInternal ? '_self' : aProps.target ?? '_blank'
          return <a {...aProps} target={target} />
        }
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  )
})

interface Markdown extends React.DOMAttributes<HTMLDivElement> {
  content: string
  loading?: boolean
  fontSize?: number
}

const Markdown: FC<Markdown> = memo(props => {
  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 16}px`
      }}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
    >
      {props.loading ? (
        <i className="i-svg-spinners:3-dots-scale-middle" />
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  )
})

export default Markdown
