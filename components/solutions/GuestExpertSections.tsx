"use client";

import { useEffect, useRef } from "react";

import DemoMobileSnapshot from "@/components/solutions/DemoMobileSnapshot";
import DemoWindowChrome from "@/components/solutions/DemoWindowChrome";
import { useDemoSimulation } from "@/components/solutions/DemoSimulationContext";
import GuestPhone from "@/components/solutions/GuestPhone";
import GuestInboxDesktopDemo from "@/components/solutions/GuestInboxDesktopDemo";
import SafariDemoShell from "@/components/solutions/SafariDemoShell";
import { DEMO_MOBILE_SNAPSHOTS } from "@/lib/demo-mobile-snapshots";
import { Highlighter } from "@/components/ui/highlighter";
import { runGuestPhoneAutoplay } from "@/lib/guest-phone-autoplay";
import { useDemoMobileSnapshot, useNarrowSolutionLayout } from "@/lib/use-match-media";
import type { SolutionDefinition } from "@/lib/solutions";

type GuestExpertSectionsProps = {
  solution: SolutionDefinition;
};

export default function GuestExpertSections({ solution }: GuestExpertSectionsProps) {
  const demo = useDemoSimulation();
  const narrow = useNarrowSolutionLayout();
  const mobileSnapshot = useDemoMobileSnapshot();
  const phoneMessages = demo.guestMessages;
  const heroIntent = demo.heroIntent;
  const skipAutoplayRef = useRef(false);

  useEffect(() => {
    if (!heroIntent) return;
    const { scenarioId } = heroIntent;
    skipAutoplayRef.current = true;
    demo.playHeroScenario(scenarioId);
    demo.setHeroIntent(null);
  }, [heroIntent, demo.playHeroScenario, demo.setHeroIntent]);

  const pickRef = useRef(demo.guestPickSuggestion);
  const resetRef = useRef(demo.resetGuestDemo);
  pickRef.current = demo.guestPickSuggestion;
  resetRef.current = demo.resetGuestDemo;

  useEffect(() => {
    if (!narrow || heroIntent) return;
    if (skipAutoplayRef.current) {
      skipAutoplayRef.current = false;
      return;
    }
    return runGuestPhoneAutoplay(
      (id) => pickRef.current(id),
      () => resetRef.current(),
    );
  }, [narrow, heroIntent]);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${solution.anchor}`;
    void navigator.clipboard.writeText(url).catch(() => null);
  };

  return (
    <>
      <article id={solution.anchor} className="solution-panel guest-expert-section">
        <div className="guest-say-hi-grid">
          <div className="guest-say-hi-copy">
            <h1 className="guest-say-hi-title">
              Say{" "}
              <Highlighter action="underline" color="rgb(34, 61, 20)" strokeWidth={2} isView>
                hello
              </Highlighter>{" "}
              to LOJJ
            </h1>
            {solution.lead ? (
              <p className="landing-p solution-summary guest-say-hi-lead">{solution.lead}</p>
            ) : null}
            <p className="landing-p solution-summary">{solution.summary}</p>
          </div>
          <div className={`guest-say-hi-phone${narrow ? " guest-say-hi-phone--autoplay" : ""}`}>
            <GuestPhone
              messages={phoneMessages}
              suggestions={narrow ? [] : demo.guestSuggestions}
              onPickSuggestion={demo.guestPickSuggestion}
              highlightedSuggestionId={narrow ? undefined : demo.guestPhase === "after_hi" ? "late" : undefined}
              interactive={!narrow}
            />
          </div>
        </div>
      </article>

      <article className="solution-panel solution-panel--viewport guest-expert-section guest-expert-section--inbox">
        <div className="guest-inbox-grid">
          <div className="guest-inbox-copy">
            <h3 className="landing-h3">One inbox for every guest thread</h3>
            <p className="landing-p solution-summary">
              Staff can view all guest chats in one place, and take over at any point to message a guest directly.
            </p>
          </div>

          <DemoWindowChrome
            anchor={solution.anchor}
            ariaLabel="Guest Expert desktop inbox"
            onCopyLink={copyLink}
            onResetScenario={() => demo.resetGuestDemo()}
            shellClassName={
              mobileSnapshot
                ? "solution-window--guest-inbox solution-window--mobile-snapshot"
                : "solution-window--guest-inbox solution-window--safari"
            }
            fillWidth
          >
            {mobileSnapshot ? (
              <DemoMobileSnapshot {...DEMO_MOBILE_SNAPSHOTS.guestInbox} />
            ) : (
              <SafariDemoShell url="riverside.lojj.io/inbox">
                <GuestInboxDesktopDemo />
              </SafariDemoShell>
            )}
          </DemoWindowChrome>
        </div>
      </article>
    </>
  );
}
