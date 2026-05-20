import SolutionWindow from "@/components/solutions/SolutionWindow";
import GuestExpertSections from "@/components/solutions/GuestExpertSections";
import OpsLeadSections from "@/components/solutions/OpsLeadSections";
import ReviewSpecialistSections from "@/components/solutions/ReviewSpecialistSections";
import { SOLUTIONS } from "@/lib/solutions";

export default function SolutionsShowcase() {
  return (
    <section
      id="features"
      className="landing-section landing-section--after-hero w-full flex justify-center mt-20 md:mt-28"
    >
      <div className="w-[95%] max-w-7xl">
        <div className="solutions-wrap">
          {SOLUTIONS.map((solution) =>
            solution.id === "guest" ? (
              <GuestExpertSections key={solution.id} solution={solution} />
            ) : solution.id === "ops" ? (
              <OpsLeadSections key={solution.id} solution={solution} />
            ) : solution.id === "reviews" ? (
              <ReviewSpecialistSections key={solution.id} solution={solution} />
            ) : (
              <SolutionWindow key={solution.id} solution={solution} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
