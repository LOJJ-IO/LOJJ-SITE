"use client";

import { useEffect, useRef, useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

type FrictionId = "handoffs" | "managers" | "new-staff";

const FRICTION: ReadonlyArray<{
  id: FrictionId;
  label: string;
  kicker: string;
  heading: string;
  copy?: string;
  bullets?: readonly string[];
}> = [
  {
    id: "handoffs",
    label: "Lost handoffs",
    kicker: "Friction 1",
    heading: "Lost handoffs",
    bullets: [
      "Guest requests pile up.",
      "Notes get missed between shifts.",
      "It’s unclear what’s already been handled.",
    ],
  },
  {
    id: "managers",
    label: "Tired managers",
    kicker: "Friction 2",
    heading: "Tired managers",
    copy: "You get interrupted for routine fixes. You’re firefighting, so leadership slips.",
  },
  {
    id: "new-staff",
    label: "New staff",
    kicker: "Friction 3",
    heading: "New staff",
    copy: "High turnover leaves your team without answers. Guests wait while junior staff scramble.",
  },
];

type PanePhase = "idle" | "exit" | "pre-enter" | "enter";

export function FrictionTabs() {
  const [activeTab, setActiveTab] = useState<FrictionId>("handoffs");
  const [phase, setPhase] = useState<PanePhase>("idle");
  const pendingTab = useRef<FrictionId | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const onValueChange = (next: string) => {
    const nextId = next as FrictionId;
    if (nextId === activeTab) return;

    pendingTab.current = nextId;
    if (timer.current) window.clearTimeout(timer.current);

    setPhase("exit");
    timer.current = window.setTimeout(() => {
      const value = pendingTab.current ?? nextId;
      setActiveTab(value);
      setPhase("pre-enter");
      window.requestAnimationFrame(() => setPhase("enter"));
      timer.current = window.setTimeout(() => setPhase("idle"), 360);
    }, 220);
  };

  return (
    <Tabs value={activeTab} onValueChange={onValueChange} className="pane-tabs w-full">
      <div className="pane-grid">
        <div
          className={`frost-pane glass-surface backdrop-blur-sm ${phase === "exit" ? "pane-exit" : ""} ${
            phase === "pre-enter" ? "pane-pre-enter" : ""
          } ${phase === "enter" ? "pane-enter" : ""}`}
        >
          <div className="backdrop-blur-sm glass-blur-plane glass-plane-pane" aria-hidden />
          <div className="glass-content frost-pane-content">
            <div className="frost-pane-body">
              {FRICTION.map((item) => (
                <TabsContent key={item.id} value={item.id} className="pane-content">
                  <div className="feature-kicker">{item.kicker}</div>
                  <h3 className="landing-h3">{item.heading}</h3>
                  {item.bullets ? (
                    <ul className="feature-list mt-3">
                      {item.bullets.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="landing-p mt-3">{item.copy}</p>
                  )}
                </TabsContent>
              ))}
            </div>

            <TabsList
              className="pane-tabs-list pane-segmented"
              aria-label="Friction carousel"
            >
              {FRICTION.map((item) => (
                <TabsPrimitive.Trigger
                  key={item.id}
                  value={item.id}
                  data-slot="tabs-trigger"
                  className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-3.5 py-3 text-sm font-extrabold tracking-tight outline-none transition-all hover:-translate-y-px hover:opacity-95 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 data-[state=active]:rounded-full data-[state=active]:border-white/35 data-[state=active]:bg-[rgba(34,61,20,0.75)] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  {item.label}
                </TabsPrimitive.Trigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="pane-visual" aria-hidden>
          <div className="visual-stack">
            <div className="visual-card visual-card-top backdrop-blur-sm glass-surface">
              <div className="backdrop-blur-sm glass-blur-plane glass-plane-card" aria-hidden />
              <div className="glass-content">
                <div className="visual-kicker">Front desk</div>
                <div className="visual-row">
                  <span className="visual-dot" />
                  <span className="visual-line" />
                </div>
                <div className="visual-row">
                  <span className="visual-dot" />
                  <span className="visual-line visual-line-short" />
                </div>
              </div>
            </div>
            <div className="visual-card visual-card-mid backdrop-blur-sm glass-surface">
              <div className="backdrop-blur-sm glass-blur-plane glass-plane-card" aria-hidden />
              <div className="glass-content">
                <div className="visual-kicker">Housekeeping</div>
                <div className="visual-row">
                  <span className="visual-dot visual-dot-green" />
                  <span className="visual-line" />
                </div>
                <div className="visual-row">
                  <span className="visual-dot visual-dot-green" />
                  <span className="visual-line visual-line-short" />
                </div>
              </div>
            </div>
            <div className="visual-card visual-card-bottom backdrop-blur-sm glass-surface">
              <div className="backdrop-blur-sm glass-blur-plane glass-plane-card" aria-hidden />
              <div className="glass-content">
                <div className="visual-kicker">Maintenance</div>
                <div className="visual-row">
                  <span className="visual-dot visual-dot-amber" />
                  <span className="visual-line" />
                </div>
                <div className="visual-row">
                  <span className="visual-dot visual-dot-amber" />
                  <span className="visual-line visual-line-short" />
                </div>
              </div>
            </div>
          </div>
          <div className="visual-glow" />
        </div>
      </div>
    </Tabs>
  );
}

