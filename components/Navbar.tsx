"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { WaitlistDialogTrigger } from "@/components/WaitlistDialog";

const SCROLL_THRESHOLD = 50;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSolid = isScrolled || mobileMenuOpen;

  const checkScroll = useCallback(() => {
    const nowScrolled = window.scrollY > SCROLL_THRESHOLD;
    setIsScrolled((prev) => (prev !== nowScrolled ? nowScrolled : prev));
  }, []);

  useEffect(() => {
    checkScroll();
    const raf = requestAnimationFrame(checkScroll);

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);

  const openMenu = useCallback(() => {
    setMobileMenuOpen(true);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  return (
    <>
      <nav
        id="main-nav"
        data-scrolled={isSolid ? "true" : "false"}
        className={`fixed top-0 right-0 left-0 z-50 transform transition-all duration-200 ease-out${isSolid ? " nav-solid" : " nav-transparent"}`}
      >
        <div className="flex w-full items-center justify-between px-10 py-6 md:px-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="lojj-logo font-romantica">
              lojj.io
            </Link>
            <div className="lojj-left-pill hidden md:inline-flex">
              <a href="#features" className="lojj-left-link">
                About
              </a>
              <a href="#features" className="lojj-left-link">
                Features
              </a>
            </div>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <WaitlistDialogTrigger className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[rgb(34,61,20)]/35 bg-transparent px-6 py-2 text-base font-medium text-[rgb(34,61,20)] transition-colors hover:bg-[rgb(34,61,20)]/8 disabled:pointer-events-none disabled:opacity-50">
              Join waitlist
            </WaitlistDialogTrigger>
            <a href="mailto:info@lojj.io">
              <button className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[rgb(34,61,20)] px-6 py-2 text-base font-medium text-[#ebeee3] transition-colors hover:bg-[rgb(34,61,20)]/90 disabled:pointer-events-none disabled:opacity-50">
                Contact
              </button>
            </a>
          </div>

          <button
            onClick={openMenu}
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Open menu"
            type="button"
          >
            <span className="h-0.5 w-6 bg-[rgb(34,61,20)] transition-all" />
            <span className="h-0.5 w-6 bg-[rgb(34,61,20)] transition-all" />
            <span className="h-0.5 w-6 bg-[rgb(34,61,20)] transition-all" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-100 flex flex-col items-center justify-center p-8 transition-[opacity,visibility] duration-300 ease${mobileMenuOpen ? " opacity-100 visible" : " opacity-0 invisible"}`}
        style={{ background: "rgba(235, 237, 233, 0.9)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
      >
        <button
          onClick={closeMenu}
          className="absolute top-10 right-10 p-2 text-black"
          aria-label="Close menu"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex flex-col items-center gap-10 text-3xl font-medium tracking-tight text-[rgb(34,61,20)]">
          <a href="#features" onClick={closeMenu} className="hover:opacity-60 transition-opacity">About</a>
          <a href="#features" onClick={closeMenu} className="hover:opacity-60 transition-opacity">Features</a>
          <WaitlistDialogTrigger asChild>
            <button
              type="button"
              onClick={closeMenu}
              className="rotating-border-btn flex items-center justify-center gap-3 px-10 h-[64px] rounded-full transition-all duration-300 button-strong-shadow"
            >
              <span className="text-white font-bold text-base transition-colors">Join waitlist</span>
            </button>
          </WaitlistDialogTrigger>
          <div className="mt-4">
            <span className="font-romantica text-4xl opacity-20">LOJJ.IO</span>
          </div>
        </div>
      </div>
    </>
  );
}
