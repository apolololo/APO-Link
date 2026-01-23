import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px) or (pointer: coarse)`)
    const onChange = () => {
      setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px) or (pointer: coarse)`).matches)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px) or (pointer: coarse)`).matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
