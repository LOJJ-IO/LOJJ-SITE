"use client";

import { useEffect, useRef } from "react";
import ScrollCanvas from "./ScrollCanvas";

interface HeroSectionProps {
  ready: boolean;
  onLoadProgress: (pct: number) => void;
}

export default function HeroSection({ ready, onLoadProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function updateProgress() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = sectionHeight - viewportHeight;
      if (scrollable <= 0) {
        progressRef.current = 0;
        return;
      }
      // rect.top is negative once we've scrolled past the top
      const scrolled = -rect.top;
      const clamped = Math.max(0, Math.min(1, scrolled / scrollable));
      progressRef.current = clamped;
    }

    function onScroll() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        updateProgress();
        rafRef.current = null;
      });
    }

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-scroll-runway" aria-label="Hero">
      <div className="hero-sticky-frame">
        <ScrollCanvas
          progressRef={progressRef}
          ready={ready}
          onLoadProgress={onLoadProgress}
        />
      </div>
    </section>
  );
}
