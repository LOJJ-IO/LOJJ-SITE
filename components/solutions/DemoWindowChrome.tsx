"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ResizableDemoWindow from "@/components/solutions/ResizableDemoWindow";

type CtxMenuState = { x: number; y: number } | null;

export default function DemoWindowChrome({
  anchor,
  ariaLabel,
  children,
  onCopyLink,
  onResetScenario,
  shellClassName,
  fillWidth,
}: {
  anchor: string;
  ariaLabel: string;
  children: React.ReactNode;
  onCopyLink: () => void;
  onResetScenario: () => void;
  shellClassName?: string;
  fillWidth?: boolean;
}) {
  const [menu, setMenu] = useState<CtxMenuState>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onPointer = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Node | null;
      if (shellRef.current?.contains(t)) return;
      closeMenu();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menu, closeMenu]);

  return (
    <div
      ref={shellRef}
      className={`solution-window solution-window--ctx${shellClassName ? ` ${shellClassName}` : ""}`}
      role="region"
      aria-label={ariaLabel}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <ResizableDemoWindow
        className="solution-window-aspect-root flex w-full min-h-0 min-w-0 flex-col overflow-hidden"
        fillWidth={fillWidth}
      >
        {children}
      </ResizableDemoWindow>
      {menu ? (
        <div
          className="demo-ctx-menu"
          style={{ left: menu.x, top: menu.y }}
          role="menu"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="demo-ctx-item"
            role="menuitem"
            onClick={() => {
              onCopyLink();
              closeMenu();
            }}
          >
            Copy link to this section
          </button>
          <button
            type="button"
            className="demo-ctx-item"
            role="menuitem"
            onClick={() => {
              onResetScenario();
              closeMenu();
            }}
          >
            Reset scenario
          </button>
          <a className="demo-ctx-item demo-ctx-link" href={`#${anchor}`} role="menuitem" onClick={closeMenu}>
            Jump to heading
          </a>
        </div>
      ) : null}
    </div>
  );
}
