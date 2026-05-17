"use client";

import { useEffect, useRef, useCallback } from "react";

import { HERO_TOTAL_FRAMES } from "@/lib/hero-scroll";

const TOTAL_FRAMES = HERO_TOTAL_FRAMES;
const MAX_DPR = 2;

function frameSrc(index: number): string {
  const n = String(index + 1).padStart(4, "0");
  return `/lower-hero/${n}.webp`;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const scale = Math.max(canvasW / iw, canvasH / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const sx = (canvasW - sw) / 2;
  const sy = (canvasH - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

interface ScrollCanvasProps {
  progressRef: React.RefObject<number>;
  ready: boolean;
  onLoadProgress?: (pct: number) => void;
}

export default function ScrollCanvas({
  progressRef,
  ready,
  onLoadProgress,
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null),
  );
  const loadedCountRef = useRef(0);
  const allLoadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const tabActiveRef = useRef(true);

  // Stable callback ref so we don't retrigger effects on parent re-renders
  const onLoadProgressRef = useRef(onLoadProgress);
  useEffect(() => {
    onLoadProgressRef.current = onLoadProgress;
  }, [onLoadProgress]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = framesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) {
      // Fallback: find nearest loaded frame
      let fallback = index;
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        const lo = index - d;
        const hi = index + d;
        const loImg = lo >= 0 ? framesRef.current[lo] : null;
        const hiImg = hi < TOTAL_FRAMES ? framesRef.current[hi] : null;
        if (loImg?.complete && loImg.naturalWidth) { fallback = lo; break; }
        if (hiImg?.complete && hiImg.naturalWidth) { fallback = hi; break; }
      }
      if (fallback === index) return;
      const fallbackImg = framesRef.current[fallback];
      if (!fallbackImg) return;
      drawCover(ctx, fallbackImg, canvas.width, canvas.height);
    } else {
      drawCover(ctx, img, canvas.width, canvas.height);
    }
  }, []);

  // Resize canvas to match display size
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // Redraw current frame after resize
      const prog = progressRef.current ?? 0;
      const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(prog * (TOTAL_FRAMES - 1))));
      drawFrame(idx);
      lastFrameRef.current = -1; // force redraw on next tick
    }
  }, [drawFrame, progressRef]);

  // Preload all frames
  useEffect(() => {
    const frames = framesRef.current;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Load only the middle frame for reduced motion
      const mid = Math.floor(TOTAL_FRAMES / 2);
      const img = new Image();
      img.onload = () => {
        frames[mid] = img;
        allLoadedRef.current = true;
        onLoadProgressRef.current?.(100);
        drawFrame(mid);
      };
      img.onerror = () => {
        allLoadedRef.current = true;
        onLoadProgressRef.current?.(100);
      };
      img.src = frameSrc(mid);
      return;
    }

    let cancelled = false;
    loadedCountRef.current = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const index = i;
      img.onload = () => {
        if (cancelled) return;
        frames[index] = img;
        loadedCountRef.current += 1;
        const pct = Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100);
        onLoadProgressRef.current?.(pct);
        if (loadedCountRef.current === TOTAL_FRAMES) {
          allLoadedRef.current = true;
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        // Count failures too so progress still reaches 100
        loadedCountRef.current += 1;
        const pct = Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100);
        onLoadProgressRef.current?.(pct);
        if (loadedCountRef.current === TOTAL_FRAMES) {
          allLoadedRef.current = true;
        }
      };
      img.src = frameSrc(i);
    }

    return () => {
      cancelled = true;
    };
  }, [drawFrame]);

  // RAF render loop
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    function tick() {
      if (!visibleRef.current || !tabActiveRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      const prog = Math.max(0, Math.min(1, progressRef.current ?? 0));
      const idx = Math.floor(prog * (TOTAL_FRAMES - 1));

      if (idx !== lastFrameRef.current) {
        lastFrameRef.current = idx;
        drawFrame(idx);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    }

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [ready, drawFrame, progressRef]);

  // IntersectionObserver: pause when offscreen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  // Page Visibility API: pause when tab hidden
  useEffect(() => {
    function onVisChange() {
      tabActiveRef.current = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, []);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      aria-label="Animated hero sequence"
      role="img"
    />
  );
}
