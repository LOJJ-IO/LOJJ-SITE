"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_WIDTH_PX = 260;
const MIN_HEIGHT_PX = 200;
const MAX_HEIGHT_PX = 1200;

type Edge = "e" | "s" | "se";

type DragSession = {
  edge: Edge;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
};

type ResizableDemoWindowProps = {
  className?: string;
  children: React.ReactNode;
  /** Keep width synced to the parent shell (e.g. guest inbox grid column). */
  fillWidth?: boolean;
};

/**
 * Desktop preview shell: drag edges to resize. Default size comes from the parent
 * shell’s fixed CSS height; only pointer drags change dimensions.
 */
export default function ResizableDemoWindow({
  className,
  children,
  fillWidth = false,
}: ResizableDemoWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<DragSession | null>(null);
  const [widthPx, setWidthPx] = useState<number | null>(null);
  const [heightPx, setHeightPx] = useState<number | null>(null);
  const [dragging, setDragging] = useState<Edge | null>(null);

  const shellWidth = useCallback(() => {
    const el = rootRef.current;
    if (!el) return 2000;
    const shell = el.parentElement;
    if (shell instanceof HTMLElement) {
      return shell.getBoundingClientRect().width;
    }
    const col = el.closest(".solution-demo-col");
    if (col instanceof HTMLElement) {
      return col.getBoundingClientRect().width;
    }
    return el.parentElement?.getBoundingClientRect().width ?? 2000;
  }, []);

  useEffect(() => {
    if (!fillWidth) return;
    const shell = rootRef.current?.parentElement;
    if (!shell) return;

    const clampToShell = () => {
      setWidthPx((w) => {
        if (w == null) return null;
        const maxW = shell.getBoundingClientRect().width;
        return Math.min(w, maxW);
      });
    };

    const ro = new ResizeObserver(clampToShell);
    ro.observe(shell);
    return () => ro.disconnect();
  }, [fillWidth]);

  const applyResize = useCallback(
    (e: PointerEvent) => {
      const s = sessionRef.current;
      if (!s) return;
      const maxW = shellWidth();
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;

      if (s.edge === "e") {
        const w = Math.min(maxW, Math.max(MIN_WIDTH_PX, s.startW + dx));
        setWidthPx(w);
      } else if (s.edge === "s") {
        const h = Math.min(
          MAX_HEIGHT_PX,
          Math.max(MIN_HEIGHT_PX, s.startH + dy),
        );
        setHeightPx(h);
      } else {
        const w = Math.min(maxW, Math.max(MIN_WIDTH_PX, s.startW + dx));
        const h = Math.min(
          MAX_HEIGHT_PX,
          Math.max(MIN_HEIGHT_PX, s.startH + dy),
        );
        setWidthPx(w);
        setHeightPx(h);
      }
    },
    [shellWidth],
  );

  useEffect(() => {
    if (!dragging) return;
    const up = () => {
      sessionRef.current = null;
      setDragging(null);
    };
    const move = (e: PointerEvent) => applyResize(e);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, applyResize]);

  const onPointerDown = useCallback(
    (edge: Edge) => (e: React.PointerEvent) => {
      if (fillWidth && (edge === "e" || edge === "se")) return;
      e.preventDefault();
      e.stopPropagation();
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      sessionRef.current = {
        edge,
        startX: e.clientX,
        startY: e.clientY,
        startW: r.width,
        startH: r.height,
      };
      setDragging(edge);
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    },
    [fillWidth],
  );

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setWidthPx(null);
    setHeightPx(null);
  }, []);

  const useExplicitWidth = !fillWidth && widthPx != null;
  const useExplicitHeight = heightPx != null;

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        width: useExplicitWidth ? `${Math.round(widthPx)}px` : "100%",
        maxWidth: "100%",
        minWidth: 0,
        ...(useExplicitHeight
          ? {
              height: `${Math.round(heightPx)}px`,
              maxHeight: `${Math.round(heightPx)}px`,
            }
          : {}),
        minHeight: 0,
        overflow: "hidden",
        marginInline: useExplicitWidth ? "auto" : undefined,
        position: "relative",
        touchAction: dragging ? "none" : undefined,
        boxSizing: "border-box",
      }}
      onDoubleClick={onDoubleClick}
      title={
        fillWidth
          ? "Drag the bottom edge to resize height. Double-click to reset."
          : "Drag edges to resize. Double-click to reset size."
      }
    >
      {children}
      {!fillWidth ? (
        <div
          className="demo-resize-handle demo-resize-handle--e"
          role="presentation"
          aria-hidden
          onPointerDown={onPointerDown("e")}
        />
      ) : null}
      <div
        className="demo-resize-handle demo-resize-handle--s"
        role="presentation"
        aria-hidden
        onPointerDown={onPointerDown("s")}
      />
      {!fillWidth ? (
        <div
          className="demo-resize-handle demo-resize-handle--se"
          role="presentation"
          aria-hidden
          onPointerDown={onPointerDown("se")}
        />
      ) : null}
    </div>
  );
}
