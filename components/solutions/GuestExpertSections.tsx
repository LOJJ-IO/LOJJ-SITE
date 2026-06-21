"use client";

import { useEffect, useRef } from "react";

import DemoMobileSnapshot from "@/components/solutions/DemoMobileSnapshot";
import DemoWindowChrome from "@/components/solutions/DemoWindowChrome";
import { useDemoSimulation } from "@/components/solutions/DemoSimulationContext";
import GuestPhone from "@/components/solutions/GuestPhone";
import GuestInboxDesktopDemo from "@/components/solutions/GuestInboxDesktopDemo";
import SafariDemoShell from "@/components/solutions/SafariDemoShell";
import { DEMO_MOBILE_SNAPSHOTS } from "@/lib/demo-mobile-snapshots";
import {
  GUEST_PHONE_INTRO_READY_MS,
  runGuestPhoneAutoplay,
} from "@/lib/guest-phone-autoplay";
import { useGuestPhoneInView } from "@/lib/use-guest-phone-in-view";
import { Highlighter } from "@/components/ui/highlighter";
import { useDemoMobileSnapshot } from "@/lib/use-match-media";
import type { SolutionDefinition } from "@/lib/solutions";

type GuestExpertSectionsProps = {
  solution: SolutionDefinition;
};

export default function GuestExpertSections({ solution }: GuestExpertSectionsProps) {
  const demo = useDemoSimulation();
  const mobileSnapshot = useDemoMobileSnapshot();
  const phoneWrapRef = useRef<HTMLDivElement>(null);
  const phoneInView = useGuestPhoneInView(phoneWrapRef);
  const cancelAutoplayRef = useRef<(() => void) | null>(null);
  const skipAutoplayRef = useRef(false);
  const pickRef = useRef(demo.guestPickSuggestion);
  pickRef.current = demo.guestPickSuggestion;

  useEffect(() => {
    if (!demo.heroIntent) return;

    cancelAutoplayRef.current?.();
    cancelAutoplayRef.current = null;
    skipAutoplayRef.current = true;

    const { scenarioId } = demo.heroIntent;
    demo.resetGuestDemo();
    demo.setHeroIntent(null);

    const timer = window.setTimeout(() => {
      demo.playHeroScenario(scenarioId);
    }, GUEST_PHONE_INTRO_READY_MS);

    return () => window.clearTimeout(timer);
  }, [demo.heroIntent, demo.playHeroScenario, demo.resetGuestDemo, demo.setHeroIntent]);

  useEffect(() => {
    if (!phoneInView) return;
    if (skipAutoplayRef.current) {
      skipAutoplayRef.current = false;
      return;
    }

    cancelAutoplayRef.current?.();
    cancelAutoplayRef.current = runGuestPhoneAutoplay((id) => pickRef.current(id));

    return () => {
      cancelAutoplayRef.current?.();
      cancelAutoplayRef.current = null;
    };
  }, [phoneInView, demo.guestDemoEpoch]);

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
          <div ref={phoneWrapRef} className="guest-say-hi-phone guest-say-hi-phone--autoplay">
            <GuestPhone messages={demo.guestMessages} introActive={phoneInView} />
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
