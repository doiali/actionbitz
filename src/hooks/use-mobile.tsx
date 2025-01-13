import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(size: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${size - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < size)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < size)
    return () => mql.removeEventListener("change", onChange)
  }, [size])

  return !!isMobile
}
