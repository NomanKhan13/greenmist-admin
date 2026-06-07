import { useCallback, useRef } from "react"

export default function useDebounce(callback: Function, delay: number) {
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const safeFn = useCallback(
    (...args: any[]) => {
      if (timeRef.current) clearTimeout(timeRef.current)
      timeRef.current = setTimeout(() => callback(...args), delay)
    },
    [callback, delay]
  )

  return safeFn
}
