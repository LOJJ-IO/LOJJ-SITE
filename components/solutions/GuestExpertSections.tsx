"use client";

import DemoWindowChrome from "@/components/solutions/DemoWindowChrome";
import { useDemoSimulation } from "@/components/solutions/DemoSimulationContext";
import GuestPhone from "@/components/solutions/GuestPhone";
import GuestInboxDesktopDemo from "@/components/solutions/GuestInboxDesktopDemo";
import { Highlighter } from "@/components/ui/highlighter";
import type { SolutionDefinition } from "@/lib/solutions";

type GuestExpertSectionsProps = {
  solution: SolutionDefinition;
};

export default function GuestExpertSections({ solution }: GuestExpertSectionsProps) {
  const demo = useDemoSimulation();
  const phoneMessages = demo.guestMessages;

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${solution.anchor}`;
    void navigator.clipboard.writeText(url).catch(() => null);
  };

  return (
    <>
      <article id={solution.anchor} className="solution-panel guest-expert-section">
        <div className="guest-say-hi-grid">
          <div className="guest-say-hi-phone">
            <GuestPhone
              messages={phoneMessages}
              suggestions={demo.guestSuggestions}
              onPickSuggestion={demo.guestPickSuggestion}
            />
          </div>
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
        </div>
      </article>

      <article className="solution-panel solution-panel--viewport guest-expert-section guest-expert-section--inbox">
        <div className="guest-inbox-grid">
          <div className="guest-inbox-copy">
            <h3 className="landing-h3">One inbox for every guest thread</h3>
            <p className="landing-p solution-summary">
              Staff see live chats beside archived threads — same LOJJ assistant, desktop-ready for handoffs and review
              flows.
            </p>
          </div>

          <DemoWindowChrome
            anchor={solution.anchor}
            ariaLabel="Guest Expert desktop inbox"
            onCopyLink={copyLink}
            onResetScenario={() => demo.resetGuestDemo()}
            shellClassName="solution-window--guest-inbox"
            fillWidth
          >
            <div className="solution-window-bar solution-window-bar--light">
              <span className="window-dots" aria-hidden>
                <span className="window-dot" />
                <span className="window-dot" />
                <span className="window-dot" />
              </span>
              <span className="window-title">Guest inbox</span>
            </div>
            <div className="solution-window-body solution-window-body--guest-inbox">
              <GuestInboxDesktopDemo />
            </div>
          </DemoWindowChrome>
        </div>
      </article>
    </>
  );
}
