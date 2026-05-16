import SolutionWindow from "@/components/solutions/SolutionWindow";
import { DemoSimulationProvider } from "@/components/solutions/DemoSimulationContext";
import { SOLUTIONS } from "@/lib/solutions";

export default function SolutionsShowcase() {
  return (
    <section id="features" className="landing-section w-full flex justify-center mt-20 md:mt-28">
      <div className="w-[95%] max-w-7xl">
        <div className="section-heading-stack">
          <h2 className="landing-h2">Solutions</h2>
        </div>
        <p className="landing-sub">Click through each interactive window to explore:</p>
        <ul className="feature-list">
          <li>
            <strong>Guest Expert</strong> — scripted guest chat and phone preview
          </li>
          <li>
            <strong>Ops Lead</strong> — task queue and follow-ups
          </li>
          <li>
            <strong>Review Specialist</strong> — outreach board and guest phone
          </li>
          <li>
            <strong>AI Manager</strong> — calendar workspace and side assistant
          </li>
        </ul>

        <DemoSimulationProvider>
          <div className="solutions-wrap">
            {SOLUTIONS.map((solution) => (
              <SolutionWindow key={solution.id} solution={solution} />
            ))}
          </div>
        </DemoSimulationProvider>
      </div>
    </section>
  );
}
