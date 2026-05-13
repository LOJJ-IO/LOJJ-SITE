import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ShaderBackground from "@/components/ShaderBackground";
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

        <section id="about" className="landing-section w-full flex justify-center mt-20 md:mt-28">
          <div className="w-[95%] max-w-7xl">
            <div className="section-heading-stack">
              <span className="section-ghost-h2" aria-hidden>
                THE FLOW
              </span>
              <h2 className="landing-h2">How it works</h2>
            </div>
            <p className="landing-sub">
              LOJJ runs as connected specialist windows. Guest Expert handles routine questions, Ops
              Lead keeps tasks visible, Review Specialist asks for feedback at the right time, and AI
              Manager supports new staff without extra radio traffic.
            </p>
          </div>
        </section>

        <SolutionsShowcase />

        <section className="landing-section w-full flex justify-center mt-20 md:mt-28">
          <div className="w-[95%] max-w-7xl">
            <div className="landing-card win-card mt-8">
              <div className="feature-kicker">The outcome</div>
              <h2 className="landing-h2">The win</h2>
              <h3 className="landing-h3 win-subhead">Uninterrupted breaks</h3>
              <p className="landing-p win-copy">
                LOJJ gives staff guidance. Managers step in only when they are needed. Operations run
                smoother, guests get steadier service, and that shows up in better reviews and more
                revenue.
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer id="waitlist" className="site-footer">
        <ShaderBackground />
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-cta">
              <h2>Get Early<br />Access</h2>

              <form
                id="footer-signup"
                className="flex flex-col gap-0 relative"
                method="post"
                action="/api/waitlist"
                noValidate
              >
                <div className="newsletter-form">
                  <input type="text" name="fullName" className="newsletter-input" placeholder="Full Name" required />
                  <button className="newsletter-btn" type="submit">OK</button>
                  <div className="form-tooltip">Please enter your full name</div>
                </div>
                <div className="newsletter-form">
                  <input type="email" name="email" className="newsletter-input" placeholder="Email" required />
                  <div className="form-tooltip">Please enter a valid email</div>
                </div>
                <div className="newsletter-form">
                  <input type="text" name="hotel" className="newsletter-input" placeholder="Hotel Name" required />
                  <div className="form-tooltip">Please enter your hotel name</div>
                </div>
                <div className="newsletter-form">
                  <input type="text" name="role" className="newsletter-input" placeholder="Role" required />
                  <div className="form-tooltip">Please enter your role</div>
                </div>
                <div className="newsletter-form">
                  <input type="text" name="location" className="newsletter-input" placeholder="Location" required />
                  <div className="form-tooltip">Please enter your location</div>
                </div>
              </form>
            </div>

            <div className="footer-links">
              <div className="link-column">
                <div className="link-column-heading">About</div>
                <a href="#about">Overview</a>
                <a href="#waitlist">Early access</a>
                <a href="/faq">FAQ</a>
              </div>
              <div className="link-column">
                <div className="link-column-heading">Features</div>
                <a href="#features">Teammates</a>
                <a href="#waitlist">Waitlist</a>
              </div>
              <div className="link-column">
                <div className="link-column-heading">Social</div>
                <a href="https://www.linkedin.com/company/lojj" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
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
