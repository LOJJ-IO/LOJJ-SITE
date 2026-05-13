"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingOverlayProps {
  progress: number;
  onComplete: () => void;
}

export default function LoadingOverlay({ progress, onComplete }: LoadingOverlayProps) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // Trigger door opening once progress hits 100
  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      // Small tick to ensure the 100 counter renders before doors move
      const raf = requestAnimationFrame(() => {
        setDoorsOpen(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [progress]);

  // After doors finish opening, call onComplete
  useEffect(() => {
    if (!doorsOpen) return;
    const top = topPanelRef.current;
    if (!top) {
      const t = setTimeout(onComplete, 1400);
      return () => clearTimeout(t);
    }

    function handleTransitionEnd(e: TransitionEvent) {
      if (e.propertyName === "transform") {
        onComplete();
      }
    }

    top.addEventListener("transitionend", handleTransitionEnd);
    // Safety fallback
    const fallback = setTimeout(onComplete, 1600);
    return () => {
      top.removeEventListener("transitionend", handleTransitionEnd);
      clearTimeout(fallback);
    };
  }, [doorsOpen, onComplete]);

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div className="loading-overlay" aria-hidden="true">
      {/* Top door panel */}
      <div
        ref={topPanelRef}
        className={`loading-door loading-door-top${doorsOpen ? " loading-door-open-top" : ""}`}
      >
        {/* Logo top-right (lives inside top panel so it moves with it) */}
        <span className="loading-logo font-romantica">lojj.io</span>
      </div>

      {/* Progress line at center split */}
      <div className="loading-progress-track" aria-hidden="true">
        <div
          className="loading-progress-bar"
          style={{ transform: `scaleX(${displayProgress / 100})` }}
        />
      </div>

      {/* Bottom door panel */}
      <div
        ref={bottomPanelRef}
        className={`loading-door loading-door-bottom${doorsOpen ? " loading-door-open-bottom" : ""}`}
      >
        {/* Counter bottom-left */}
        <span className="loading-counter">{displayProgress}</span>
        {/* Small square bottom-right (matches reference) */}
        <span className="loading-square" aria-hidden="true" />
      </div>
    </div>
  );
}
