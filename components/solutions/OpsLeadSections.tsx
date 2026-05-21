"use client";

import DemoMobileSnapshot from "@/components/solutions/DemoMobileSnapshot";
import DemoWindowChrome from "@/components/solutions/DemoWindowChrome";
import { useDemoSimulation } from "@/components/solutions/DemoSimulationContext";
import OpsLeadKanbanDemo from "@/components/solutions/OpsLeadKanbanDemo";
import SafariDemoShell from "@/components/solutions/SafariDemoShell";
import { DEMO_MOBILE_SNAPSHOTS } from "@/lib/demo-mobile-snapshots";
import { useDemoMobileSnapshot } from "@/lib/use-match-media";
import type { SolutionDefinition } from "@/lib/solutions";

type OpsLeadSectionsProps = {
  solution: SolutionDefinition;
};

export default function OpsLeadSections({ solution }: OpsLeadSectionsProps) {
  const demo = useDemoSimulation();
  const mobileSnapshot = useDemoMobileSnapshot();

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${solution.anchor}`;
    void navigator.clipboard.writeText(url).catch(() => null);
  };

  return (
    <article id={solution.anchor} className="solution-panel solution-panel--viewport ops-lead-section">
      <div className="ops-lead-grid">
        <div className="ops-lead-copy">
          <h3 className="landing-h3">{solution.heading}</h3>
          <p className="landing-p solution-summary">{solution.summary}</p>
        </div>

        <div className="ops-lead-demo">
          <DemoWindowChrome
            anchor={solution.anchor}
            ariaLabel="Ops Lead task board"
            onCopyLink={copyLink}
            onResetScenario={() => demo.resetOpsExtras()}
            shellClassName={
              mobileSnapshot
                ? "solution-window--ops-kanban solution-window--mobile-snapshot"
                : "solution-window--ops-kanban solution-window--safari"
            }
            fillWidth
          >
            {mobileSnapshot ? (
              <DemoMobileSnapshot {...DEMO_MOBILE_SNAPSHOTS.opsLeadKanban} />
            ) : (
              <SafariDemoShell url="riverside.lojj.io/tasks">
                <OpsLeadKanbanDemo />
              </SafariDemoShell>
            )}
          </DemoWindowChrome>
        </div>
      </div>
    </article>
  );
}
