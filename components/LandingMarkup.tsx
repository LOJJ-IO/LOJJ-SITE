import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import EndCtaSection from "@/components/EndCtaSection";
import { FooterWaitlistCta } from "@/components/WaitlistDialog";
import SolutionsShowcase from "@/components/solutions/SolutionsShowcase";

interface LandingMarkupProps {
  doorsOpen: boolean;
  onLoadProgress: (pct: number) => void;
}

export default function LandingMarkup({ doorsOpen, onLoadProgress }: LandingMarkupProps) {
  return (
    <>
      <Navbar />

      <main className="landing-main w-full">
        <HeroSection ready={doorsOpen} onLoadProgress={onLoadProgress} />

        <SolutionsShowcase />

        <EndCtaSection />
      </main>

      <footer id="waitlist" className="site-footer site-footer--sage">
        <div className="footer-inner">
          <div className="footer-top">
            <FooterWaitlistCta />
          </div>

          <div className="footer-bottom">
            <div className="copyright">
              &copy; 2026 LOJJ.IO &mdash; All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
