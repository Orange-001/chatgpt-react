import { useWindowSize } from 'react-use'

export function useMobileScreen() {
  const { width } = useWindowSize()

  return width < 768
}
