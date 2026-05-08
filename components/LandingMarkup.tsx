import { TeammatesTabs } from "./TeammatesTabs";

export default function LandingMarkup() {
  return (
    <>
      <nav
        id="main-nav"
        className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm transform transition-transform duration-300 ease-out"
      >
        <div className="flex w-full items-center justify-between px-10 py-6 md:px-16">
          <div className="flex items-center gap-6">
            <a href="/" className="lojj-logo font-romantica">
              lojj.io
            </a>
            <div className="lojj-left-pill hidden md:inline-flex">
              <a href="#about" className="lojj-left-link">
                About
              </a>
              <a href="#features" className="lojj-left-link">
                Features
              </a>
            </div>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <a href="#waitlist">
              <button className="inline-flex cursor-pointer items-center justify-center rounded-full py-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 border bg-transparent hover:text-white h-10 px-6 text-base border-snow/50 text-snow hover:border-white hover:bg-white/10">
                Join waitlist
              </button>
            </a>
            <a href="mailto:info@lojj.io">
              <button className="inline-flex cursor-pointer items-center justify-center rounded-full py-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-snow text-black hover:bg-white h-10 px-6 text-base">
                Contact
              </button>
            </a>
          </div>

          <button
            id="hamburger-btn"
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Toggle menu"
            type="button"
          >
            <span className="bg-snow h-0.5 w-6 transition-all" />
            <span className="bg-snow h-0.5 w-6 transition-all" />
            <span className="bg-snow h-0.5 w-6 transition-all" />
          </button>
        </div>
      </nav>

      <main className="landing-main w-full">
        <section className="relative w-full flex justify-center pt-28 md:pt-32">
          <div
            id="dynamic-hero-box"
            className="visible w-[95%] max-w-7xl min-h-[520px] md:min-h-[640px] flex flex-col items-start justify-center text-left px-6 py-10 md:px-20 md:py-12 relative overflow-hidden shadow-2xl"
          >
            <div className="hero-sheen" aria-hidden />

            <div className="hero-content relative z-10 flex flex-col items-start">
              <div className="max-w-3xl">
                <h1 className="hero-heading font-bold text-white mb-5 md:mb-7 tracking-tight max-w-3xl">
                  Your best, every time
                </h1>
                <p className="text-white/90 text-base md:text-xl font-semibold leading-relaxed max-w-2xl">
                  A hospitality platform built to help every shift deliver the same great guest
                  experience.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="#waitlist"
                  data-scroll-waitlist
                  className="rotating-border-btn inline-flex items-center justify-center gap-3 px-10 md:px-12 h-[64px] md:h-[68px] rounded-full transition-all duration-300 group button-strong-shadow"
                >
                  <span className="text-white font-bold text-base md:text-lg transition-colors">
                    Join the waitlist
                  </span>
                </a>
                <a
                  href="#features"
                  className="hero-secondary-btn inline-flex items-center justify-center px-10 md:px-12 h-[64px] md:h-[68px] rounded-full text-white font-bold text-base md:text-lg"
                >
                  See features
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="landing-section w-full flex justify-center mt-20 md:mt-28">
          <div className="w-[95%] max-w-7xl">
            <div className="section-heading-stack">
              <span className="section-ghost-h2" aria-hidden>
                THE FRICTION
              </span>
              <h2 className="landing-h2">The friction</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-8">
              <div className="landing-card">
                <h3 className="landing-h3">New staff</h3>
                <p className="landing-p">
                  High turnover leaves your team without answers. Guests wait while junior staff
                  scramble.
                </p>
              </div>
              <div className="landing-card">
                <h3 className="landing-h3">Tired managers</h3>
                <p className="landing-p">
                  You get interrupted for routine fixes. You’re firefighting, so leadership slips.
                </p>
              </div>
              <div className="landing-card">
                <h3 className="landing-h3">Lost handoffs</h3>
                <p className="landing-p">
                  Guest requests pile up, notes get missed between shifts, and it’s unclear what’s
                  already been handled.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="landing-section w-full flex justify-center mt-20 md:mt-28"
        >
          <div className="w-[95%] max-w-7xl">
            <div className="section-heading-stack">
              <span className="section-ghost-h2" aria-hidden>
                EXPERT TEAM
              </span>
              <h2 className="landing-h2">Meet your expert team</h2>
            </div>
            <p className="landing-sub">
              LOJJ connects to your site and tools to handle common guest questions, keep tasks
              updated as they change, and help you get better reviews—so your team can stay on
              the floor.
            </p>

            <div className="mt-4">
              <TeammatesTabs />
            </div>
          </div>
        </section>

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

        <section
          id="faq"
          className="landing-section w-full flex justify-center mt-20 md:mt-28"
          aria-labelledby="faq-heading"
        >
          <div className="w-[95%] max-w-7xl">
            <div className="section-heading-stack">
              <span className="section-ghost-h2" aria-hidden>
                FAQ
              </span>
              <h2 id="faq-heading" className="landing-h2">
                Front desk FAQ automation, without the chaos
              </h2>
            </div>
            <p className="landing-sub">
              If you’re searching for ways to reduce front desk phone calls, handle repetitive guest
              questions, and track what staff are doing across shifts—this is what LOJJ is built for.
            </p>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-8">
              <details className="landing-card">
                <summary className="landing-h3">How do I reduce front desk phone calls?</summary>
                <p className="landing-p mt-3">
                  Give guests self‑service information (FAQs, policies, hours, parking, Wi‑Fi) and a
                  simple way to submit requests. LOJJ acts as a digital concierge so common questions
                  get answered without a call.
                </p>
              </details>

              <details className="landing-card">
                <summary className="landing-h3">What if my front desk is understaffed?</summary>
                <p className="landing-p mt-3">
                  When staffing is tight, consistency matters more. LOJJ reduces interruptions by
                  automating hotel guest FAQs and routing requests into clear tasks—so fewer issues
                  bounce back to managers.
                </p>
              </details>

              <details className="landing-card">
                <summary className="landing-h3">How can I track hotel staff tasks?</summary>
                <p className="landing-p mt-3">
                  LOJJ is a hotel task management system that keeps requests visible, assigned, and
                  updated. You can see what’s in progress, what’s done, and what’s blocked—without
                  chasing radio calls.
                </p>
              </details>

              <details className="landing-card">
                <summary className="landing-h3">
                  Can guests access info via QR codes or self‑service pages?
                </summary>
                <p className="landing-p mt-3">
                  Yes. Many hotels use QR code guest information pages so guests can find answers
                  quickly. LOJJ helps you structure and maintain that information so it stays current.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section
          id="waitlist"
          className="landing-section w-full flex justify-center mt-20 md:mt-28"
        >
          <div className="w-[95%] max-w-7xl">
            <div className="waitlist-heading">
              <h2 className="landing-h2">Start today</h2>
              <p className="landing-sub">
                Join the waitlist to get early access to LOJJ.
              </p>
            </div>
            <div className="waitlist-card">
              <form
                id="waitlist-form"
                className="waitlist-form"
                method="post"
                action="/api/waitlist"
                noValidate
              >
                <div className="waitlist-grid">
                  <label className="waitlist-field">
                    <span className="sr-only">Full name</span>
                    <input
                      className="waitlist-input"
                      name="fullName"
                      placeholder="Full name"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="waitlist-field">
                    <span className="sr-only">Email</span>
                    <input
                      className="waitlist-input"
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label className="waitlist-field">
                    <span className="sr-only">Hotel</span>
                    <input
                      className="waitlist-input"
                      name="hotel"
                      placeholder="Hotel"
                      autoComplete="organization"
                      required
                    />
                  </label>
                  <label className="waitlist-field">
                    <span className="sr-only">Role</span>
                    <input className="waitlist-input" name="role" placeholder="Role" required />
                  </label>
                  <label className="waitlist-field waitlist-field-full">
                    <span className="sr-only">Location</span>
                    <input className="waitlist-input" name="location" placeholder="Location" required />
                  </label>
                </div>
                <button className="waitlist-submit rotating-border-btn button-strong-shadow" type="submit">
                  Join waitlist
                </button>
                <div className="waitlist-status" aria-live="polite" />
              </form>
            </div>
          </div>
        </section>
      </main>

        <footer id="signup" className="site-footer">
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
    </footer>

        <div id="mobile-menu" className="fixed inset-0 z-[100] invisible opacity-0 flex flex-col items-center justify-center p-8">
        <button id="close-menu" className="absolute top-10 right-10 p-2 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="flex flex-col items-center gap-10 text-3xl font-medium tracking-tight text-[rgb(34,61,20)]">
            <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
            <a href="#features" className="hover:opacity-60 transition-opacity">Features</a>
            <a href="#waitlist" className="rotating-border-btn flex items-center justify-center gap-3 px-10 h-[64px] rounded-full transition-all duration-300 button-strong-shadow">
                <span className="text-white font-bold text-base transition-colors">Join waitlist</span>
            </a>
            <div className="mt-4">
                <span className="font-romantica text-4xl opacity-20">LOJJ.IO</span>
            </div>
        </div>
    </div>
    </>
  );
}
