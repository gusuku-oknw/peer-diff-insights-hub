
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  console.log("useIsMobile hook called");
  
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    console.log("useIsMobile useEffect setting up");
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      console.log("useIsMobile onChange:", newIsMobile);
      setIsMobile(newIsMobile)
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Set initial value
    
    return () => {
      console.log("useIsMobile cleanup");
      mql.removeEventListener("change", onChange)
    }
  }, [])

  console.log("useIsMobile returning:", isMobile);
  return !!isMobile
}
