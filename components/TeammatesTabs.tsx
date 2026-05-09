"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

const TEAMMATES = [
  {
    id: "guest",
    label: "Guest Expert",
    kicker: "Teammate 1",
    heading: "Guest Expert",
    bullets: [
      "AI guest chat on your site, available 24/7",
      "Replies in multiple languages",
      "~80% of routine questions handled, so staff can stay with guests",
    ],
    image: "/teammates/ai-manager.png",
  },
  {
    id: "ops",
    label: "Ops Lead",
    kicker: "Teammate 2",
    heading: "Ops Lead",
    bullets: [
      "Connects to your existing systems",
      "Live task updates and assignments",
      "Track property health, spot issues early, and reduce missed cleans",
    ],
    image: "/teammates/ops-lead.png",
  },
  {
    id: "reviews",
    label: "Review Specialist",
    kicker: "Teammate 3",
    heading: "Review Specialist",
    bullets: [
      "Flags happy guests as feedback comes in",
      "Sends 5-star review requests automatically (with links)",
      "More reviews that help your rankings and revenue grow",
    ],
    image: "/teammates/review-specialist.png",
  },
  {
    id: "manager",
    label: "AI Manager",
    kicker: "Teammate 4",
    heading: "AI Manager",
    bullets: [
      "Quick answers for new-staff questions",
      "A helpful assistant for front deskers during busy moments",
      "Same answers every shift, without chasing a manager",
    ],
    image: "/teammates/ai-manager.png",
  },
] as const;

export function TeammatesTabs() {
  const [activeTab, setActiveTab] = useState<(typeof TEAMMATES)[number]["id"]>("guest");
  const [phase, setPhase] = useState<"idle" | "exit" | "pre-enter" | "enter">("idle");
  const pendingTab = useRef<(typeof TEAMMATES)[number]["id"] | null>(null);
  const timer = useRef<number | null>(null);
  const activeTeammate = useMemo(
    () => TEAMMATES.find((teammate) => teammate.id === activeTab) ?? TEAMMATES[0],
    [activeTab],
  );

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const next = value as (typeof TEAMMATES)[number]["id"];
        if (next === activeTab) return;
        pendingTab.current = next;
        if (timer.current) window.clearTimeout(timer.current);

        setPhase("exit");
        timer.current = window.setTimeout(() => {
          const v = pendingTab.current ?? next;
          setActiveTab(v);
          setPhase("pre-enter");
          window.requestAnimationFrame(() => setPhase("enter"));
          timer.current = window.setTimeout(() => setPhase("idle"), 360);
        }, 220);
      }}
      className="teammates-tabs w-full"
    >
      <div className="teammates-grid">
        <div
          className={`teammates-text frost-pane glass-surface backdrop-blur-sm ${phase === "exit" ? "pane-exit" : ""} ${
            phase === "pre-enter" ? "pane-pre-enter" : ""
          } ${phase === "enter" ? "pane-enter" : ""}`}
        >
          <div className="backdrop-blur-sm glass-blur-plane glass-plane-pane" aria-hidden />
          <div className="glass-content frost-pane-content">
            <div className="frost-pane-body">
              {TEAMMATES.map((teammate) => (
                <TabsContent key={teammate.id} value={teammate.id} className="pane-content">
                  <div className="feature-kicker">{teammate.kicker}</div>
                  <h3 className="landing-h3">{teammate.heading}</h3>
                  <ul className="feature-list">
                    {teammate.bullets.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </div>

            <TabsList
              className="pane-tabs-list pane-segmented"
              aria-label="Teammates carousel"
            >
              {TEAMMATES.map((teammate) => (
                <TabsPrimitive.Trigger
                  key={teammate.id}
                  value={teammate.id}
                  data-slot="tabs-trigger"
                  className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-3.5 py-3 text-sm font-extrabold tracking-tight outline-none transition-all hover:-translate-y-px hover:opacity-95 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 data-[state=active]:rounded-full data-[state=active]:border-white/35 data-[state=active]:bg-[rgba(34,61,20,0.75)] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  {teammate.label}
                </TabsPrimitive.Trigger>
              ))}
            </TabsList>
          </div>
        </div>
        <div className="teammates-phone-wrap" aria-hidden>
          <div className="phone-frame">
            <div className="phone-notch" />
            <img
              src={activeTeammate.image}
              alt={`${activeTeammate.heading} mobile interface`}
              className="phone-screen"
            />
          </div>
        </div>
      </div>
    </Tabs>
  );
}
