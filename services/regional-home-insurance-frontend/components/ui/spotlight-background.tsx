"use client"

/**
 * SpotlightBackground — cursor-following radial glow
 * ─────────────────────────────────────────────────────────────────────────────
 * State machine (all state lives in refs — zero React re-renders):
 *
 *   'tracking'  Mouse is inside the container.
 *               target  = live mouse position
 *               lerp    = 0.18  (snappy, ~1-2 frames lag)
 *
 *   'drifting'  Mouse moved to sidebar or another element outside the container.
 *               target  = centre of the container
 *               lerp    = 0.05  (slow, graceful ease toward centre)
 *
 *   'frozen'    Mouse truly left the browser window (relatedTarget === null).
 *               Light stays at whatever position it had — no movement.
 *               Loop self-stops to save CPU.
 *
 * On re-entry:  state → 'tracking', loop restarts from current position,
 *               so the light smoothly follows from wherever it froze/drifted.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

type State = "tracking" | "drifting" | "frozen"

// Lerp factors — tweak here to change feel
const LERP_TRACKING = 0.18   // snappy follow
const LERP_DRIFTING = 0.05   // slow drift to centre
const SETTLE_PX     = 0.5    // stop loop when within 0.5px of target

interface SpotlightBackgroundProps {
  children:   React.ReactNode
  className?: string
  /** Spotlight radius in px (default 650) */
  size?:      number
  /** Peak opacity of the glow 0–1 (default 0.18) */
  intensity?: number
}

export default function SpotlightBackground({
  children,
  className,
  size      = 650,
  intensity = 0.18,
}: SpotlightBackgroundProps) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const rafRef          = useRef<number | undefined>(undefined)
  const isLoopRunning   = useRef(false)

  // All position + state in refs — writing these never triggers a render
  const pos   = useRef({ currentX: -9999, currentY: -9999, targetX: 0, targetY: 0 })
  const state = useRef<State>("frozen")

  // ── Continuous lerp loop ────────────────────────────────────────────────────

  const startLoop = useCallback(() => {
    if (isLoopRunning.current) return   // already running, nothing to do
    isLoopRunning.current = true

    const tick = () => {
      // 'frozen' → light should not move; stop the loop
      if (state.current === "frozen") {
        isLoopRunning.current = false
        return
      }

      const el = containerRef.current
      if (!el) { isLoopRunning.current = false; return }

      const lerpFactor = state.current === "tracking" ? LERP_TRACKING : LERP_DRIFTING

      // Exponential lerp: current += (target - current) * factor
      pos.current.currentX += (pos.current.targetX - pos.current.currentX) * lerpFactor
      pos.current.currentY += (pos.current.targetY - pos.current.currentY) * lerpFactor

      // Write directly to CSS custom property — no React involved
      el.style.setProperty("--sl-x", `${pos.current.currentX}px`)
      el.style.setProperty("--sl-y", `${pos.current.currentY}px`)

      // When drifting and close enough to centre, snap and stop
      const dx = Math.abs(pos.current.targetX - pos.current.currentX)
      const dy = Math.abs(pos.current.targetY - pos.current.currentY)
      if (state.current === "drifting" && dx < SETTLE_PX && dy < SETTLE_PX) {
        el.style.setProperty("--sl-x", `${pos.current.targetX}px`)
        el.style.setProperty("--sl-y", `${pos.current.targetY}px`)
        isLoopRunning.current = false
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── Event handlers ──────────────────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // ① Mouse moves inside the container → track it
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      pos.current.targetX = e.clientX - rect.left
      pos.current.targetY = e.clientY - rect.top

      // First ever move: snap current = target so light doesn't travel from -9999
      if (pos.current.currentX === -9999) {
        pos.current.currentX = pos.current.targetX
        pos.current.currentY = pos.current.targetY
      }

      state.current = "tracking"
      startLoop()
    }

    // ② Mouse leaves the container (goes to sidebar etc.) → drift to centre
    //    (will be overridden to 'frozen' if the document also fires a leave)
    const onMouseLeave = () => {
      if (state.current === "frozen") return   // browser-exit already froze it
      const rect = el.getBoundingClientRect()
      pos.current.targetX = rect.width  / 2
      pos.current.targetY = rect.height / 2
      state.current = "drifting"
      startLoop()
    }

    // ③ Mouse re-enters the container → unfreeze and track immediately
    const onMouseEnter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      pos.current.targetX = e.clientX - rect.left
      pos.current.targetY = e.clientY - rect.top
      state.current = "tracking"
      startLoop()
    }

    // ④ Mouse truly leaves the browser window (relatedTarget is null outside the page)
    //    → freeze light at its current position
    const onDocumentLeave = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        state.current = "frozen"
        // Loop will self-stop on its next tick
      }
    }

    // ⑤ Mouse re-enters the browser from outside → unfreeze
    const onDocumentEnter = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        // Don't start tracking yet — wait for onMouseMove/onMouseEnter
        // Just unfreeze so the container listeners can take over
        if (state.current === "frozen") state.current = "drifting"
      }
    }

    el.addEventListener("mousemove",  onMouseMove,  { passive: true })
    el.addEventListener("mouseleave", onMouseLeave, { passive: true })
    el.addEventListener("mouseenter", onMouseEnter, { passive: true })
    document.addEventListener("mouseleave", onDocumentLeave, { passive: true })
    document.addEventListener("mouseenter", onDocumentEnter, { passive: true })

    return () => {
      el.removeEventListener("mousemove",  onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
      el.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onDocumentLeave)
      document.removeEventListener("mouseenter", onDocumentEnter)
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      isLoopRunning.current = false
    }
  }, [startLoop])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={
        {
          "--sl-x":         "-9999px",   // off-screen until first mousemove
          "--sl-y":         "-9999px",
          "--sl-size":      `${size}px`,
          "--sl-intensity": intensity,
        } as React.CSSProperties
      }
    >
      {/* Spotlight glow layer — GPU composited, never causes layout */}
      <div
        aria-hidden
        className="spotlight-layer pointer-events-none absolute inset-0 z-0"
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
