import { Message } from '@/store/chat'

export function estimateTokenLength(input: string): number {
  let tokenLength = 0

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i)

    if (charCode < 128) {
      // ASCII character
      if (charCode <= 122 && charCode >= 65) {
        // a-Z
        tokenLength += 0.25
      } else {
        tokenLength += 0.5
      }
    } else {
      // Unicode character
      tokenLength += 1.5
    }
  }

  return tokenLength
}

export function countMessagesToken(messages: Message[]) {
  return messages.reduce(
    (pre, cur) => pre + estimateTokenLength(cur.content),
    0
  )
}
