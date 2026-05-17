"use client";

import DemoWindowChrome from "@/components/solutions/DemoWindowChrome";
import { useDemoSimulation } from "@/components/solutions/DemoSimulationContext";
import OpsLeadKanbanDemo from "@/components/solutions/OpsLeadKanbanDemo";
import type { SolutionDefinition } from "@/lib/solutions";

type OpsLeadSectionsProps = {
  solution: SolutionDefinition;
};

export default function OpsLeadSections({ solution }: OpsLeadSectionsProps) {
  const demo = useDemoSimulation();

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${solution.anchor}`;
    void navigator.clipboard.writeText(url).catch(() => null);
  };

  return (
    <article id={solution.anchor} className="solution-panel solution-panel--viewport ops-lead-section">
      <div className="ops-lead-grid">
        <DemoWindowChrome
          anchor={solution.anchor}
          ariaLabel="Ops Lead task board"
          onCopyLink={copyLink}
          onResetScenario={() => demo.resetOpsExtras()}
          shellClassName="solution-window--ops-kanban"
          fillWidth
        >
          <div className="solution-window-bar solution-window-bar--light">
            <span className="window-dots" aria-hidden>
              <span className="window-dot" />
              <span className="window-dot" />
              <span className="window-dot" />
            </span>
            <span className="window-title">{solution.demo.title}</span>
          </div>
          <div className="solution-window-body solution-window-body--ops-kanban">
            <OpsLeadKanbanDemo />
          </div>
        </DemoWindowChrome>

        <div className="ops-lead-copy">
          <h3 className="landing-h3">{solution.heading}</h3>
          <p className="landing-p solution-summary">{solution.summary}</p>
        </div>
      </div>
    </article>
  );
}
