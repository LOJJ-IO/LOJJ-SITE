"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cloneElement, isValidElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitWaitlistForm } from "@/lib/waitlistSubmit";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistDialogContextValue = {
  openWaitlist: () => void;
};

const WaitlistDialogContext = createContext<WaitlistDialogContextValue | null>(null);

export function useWaitlistDialog() {
  const ctx = useContext(WaitlistDialogContext);
  if (!ctx) {
    throw new Error("useWaitlistDialog must be used within WaitlistProvider");
  }
  return ctx;
}

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openWaitlist = useCallback(() => setOpen(true), []);

  return (
    <WaitlistDialogContext.Provider value={{ openWaitlist }}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setStatus("");
        }}
      >
        <DialogContent className="sm:max-w-md border-white/15 bg-[rgb(18,28,22)]">
          <form
            id="waitlist-dialog-form"
            method="post"
            action="/api/waitlist"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              setStatus("");
              const fd = new FormData(form);
              const fullName = String(fd.get("fullName") ?? "").trim();
              const email = String(fd.get("email") ?? "").trim();
              const hotel = String(fd.get("hotel") ?? "").trim();
              const role = String(fd.get("role") ?? "").trim();
              const location = String(fd.get("location") ?? "").trim();
              if (!fullName || !email || !hotel || !role || !location) {
                setStatus("Please fill in every field.");
                return;
              }
              if (!emailRegex.test(email)) {
                setStatus("Please enter a valid email.");
                return;
              }
              setSubmitting(true);
              try {
                const message = await submitWaitlistForm(form);
                setStatus(message);
                form.reset();
                window.setTimeout(() => {
                  setOpen(false);
                  setStatus("");
                }, 1600);
              } catch (err) {
                setStatus(err instanceof Error ? err.message : "Couldn't submit. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Join the waitlist</DialogTitle>
              <DialogDescription className="mb-6 sm:mb-8">
                We&apos;ll reach out once LOJJ is ready for your hotel
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="waitlist-fullName">Full name</Label>
                <Input
                  id="waitlist-fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Full Name"
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="waitlist-email">Email</Label>
                <Input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="waitlist-hotel">Hotel</Label>
                <Input
                  id="waitlist-hotel"
                  name="hotel"
                  autoComplete="organization"
                  placeholder="Hotel Name"
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="waitlist-role">Role</Label>
                <Input id="waitlist-role" name="role" placeholder="Role" required />
              </Field>
              <Field>
                <Label htmlFor="waitlist-location">Location</Label>
                <Input id="waitlist-location" name="location" placeholder="Location" required />
              </Field>
            </FieldGroup>
            {status ? (
              <p className="text-sm text-white/80" aria-live="polite">
                {status}
              </p>
            ) : null}
            <DialogFooter className="mt-6 sm:mt-8">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Joining…" : "Join waitlist"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </WaitlistDialogContext.Provider>
  );
}

type WaitlistDialogTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
};

export function WaitlistDialogTrigger({ children, className, asChild }: WaitlistDialogTriggerProps) {
  const { openWaitlist } = useWaitlistDialog();

  const onActivate = (e: MouseEvent) => {
    e.preventDefault();
    openWaitlist();
  };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ onClick?: (e: MouseEvent) => void; className?: string }>;
    return cloneElement(child, {
      onClick: (e: MouseEvent) => {
        child.props.onClick?.(e);
        onActivate(e);
      },
      className: [child.props.className, className].filter(Boolean).join(" ") || undefined,
    });
  }

  return (
    <button type="button" className={className} onClick={onActivate}>
      {children}
    </button>
  );
}

/** Footer heading + primary CTA; link-style waitlist actions. */
export function FooterWaitlistCta() {
  const { openWaitlist } = useWaitlistDialog();

  return (
    <>
      <div className="footer-cta">
        <h2 className="footer-cta-heading">Get early access</h2>
        <WaitlistDialogTrigger className="footer-waitlist-btn rotating-border-btn inline-flex items-center justify-center gap-3 px-10 sm:px-12 h-[52px] sm:h-[58px] rounded-full transition-all duration-300 button-strong-shadow cursor-pointer">
          <span className="footer-waitlist-btn-label font-bold text-base tracking-tight">Join the waitlist</span>
        </WaitlistDialogTrigger>
      </div>

      <div className="footer-links">
        <div className="link-column">
          <div className="link-column-heading">About</div>
          <a href="https://www.lojj.io/">Website</a>
          <a href="#features">Overview</a>
          <button type="button" className="footer-link-action" onClick={openWaitlist}>
            Early access
          </button>
          <a href="/faq">FAQ</a>
        </div>
        <div className="link-column">
          <div className="link-column-heading">Features</div>
          <a href="#features">Teammates</a>
          <button type="button" className="footer-link-action" onClick={openWaitlist}>
            Waitlist
          </button>
        </div>
        <div className="link-column">
          <div className="link-column-heading">Social</div>
          <a href="https://www.linkedin.com/company/lojj" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
