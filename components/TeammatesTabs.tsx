"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const activeTeammate = useMemo(
    () => TEAMMATES.find((teammate) => teammate.id === activeTab) ?? TEAMMATES[0],
    [activeTab],
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as (typeof TEAMMATES)[number]["id"])}
      className="teammates-tabs w-full"
    >
      <div className="teammates-grid">
        <div className="teammates-text">
          <TabsList>
            {TEAMMATES.map((teammate) => (
              <TabsTrigger key={teammate.id} value={teammate.id}>
                {teammate.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TEAMMATES.map((teammate) => (
            <TabsContent key={teammate.id} value={teammate.id}>
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
