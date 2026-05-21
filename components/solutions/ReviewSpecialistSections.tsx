"use client";

import ReviewBeamDemo from "@/components/solutions/ReviewBeamDemo";
import type { SolutionDefinition } from "@/lib/solutions";

type ReviewSpecialistSectionsProps = {
  solution: SolutionDefinition;
};

export default function ReviewSpecialistSections({ solution }: ReviewSpecialistSectionsProps) {
  return (
    <article id={solution.anchor} className="solution-panel solution-panel--viewport review-specialist-section">
      <div className="review-specialist-grid review-specialist-grid--stacked">
        <div className="review-specialist-copy">
          <h3 className="landing-h3">{solution.heading}</h3>
          <p className="landing-p solution-summary">{solution.summary}</p>
        </div>

        <div
          className="review-routing-shell review-routing-shell--wide"
          role="region"
          aria-label="Review Specialist routing demo"
        >
          <ReviewBeamDemo />
        </div>
      </div>
    </article>
  );
}
