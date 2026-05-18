"use client"

import { useEffect, useRef, useState } from "react"
import { Confetti, type ConfettiRef } from "~/components/ui/confetti"

export function HomeConfetti() {
  const confettiRef = useRef<ConfettiRef>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      confettiRef.current?.fire({ particleCount: 0 })
      setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <Confetti
      ref={confettiRef}
      manualstart={false}
      options={{
        particleCount: 120,
        spread: 90,
        origin: { y: 0.3 },
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  )
}
