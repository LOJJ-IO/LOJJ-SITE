"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitWaitlistForm } from "@/lib/waitlistSubmit";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HeroWaitlistDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setStatus("");
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="hero-waitlist-trigger rotating-border-btn inline-flex items-center justify-center gap-3 px-11 sm:px-14 h-[58px] sm:h-[66px] rounded-full transition-all duration-300 group button-strong-shadow pointer-events-auto cursor-pointer"
        >
          <span className="text-white font-bold text-base sm:text-lg tracking-tight transition-colors">
            Join the waitlist
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-white/15 bg-[rgb(18,28,22)]">
        <form
          id="hero-waitlist-form"
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
              setStatus(err instanceof Error ? err.message : "Couldn’t submit. Please try again.");
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
              <Label htmlFor="hero-fullName">Full name</Label>
              <Input
                id="hero-fullName"
                name="fullName"
                autoComplete="name"
                placeholder="Full Name"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="hero-email">Email</Label>
              <Input
                id="hero-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="hero-hotel">Hotel</Label>
              <Input
                id="hero-hotel"
                name="hotel"
                autoComplete="organization"
                placeholder="Hotel Name"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="hero-role">Role</Label>
              <Input id="hero-role" name="role" placeholder="Role" required />
            </Field>
            <Field>
              <Label htmlFor="hero-location">Location</Label>
              <Input id="hero-location" name="location" placeholder="Location" required />
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
  );
}
