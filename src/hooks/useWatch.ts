export function useWatch<V, F extends (value: V, oldValue?: V) => void>(
  value: V,
  callback: F,
  config?: { immediate: boolean }
) {
  const oldValueRef = useRef<V>()
  const noFirst = useRef(false)

  useEffect(() => {
    if (config?.immediate) {
      callback(value, oldValueRef.current)
    } else if (noFirst.current) {
      callback(value, oldValueRef.current)
    }
    noFirst.current = true
    oldValueRef.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
}
