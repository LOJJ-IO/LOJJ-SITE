import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about LOJJ for hotel managers: reducing front desk calls, training support for new staff, and task tracking across shifts.",
  alternates: {
    canonical: "/faq",
  },
};

type FaqItem = {
  value: string;
  q: string;
  a: React.ReactNode;
};

const faqs: FaqItem[] = [
  {
    value: "training-support",
    q: "Our property deals with a lot of new staff training. How could LOJJ help us support employees during customer situations?",
    a: (
      <>
        LOJJ gives your team a simple place to look up your own policies and procedures while they
        are with a guest. New hires can get the right answer without calling a supervisor every time.
        That cuts down front desk interruptions and helps keep service consistent on busy shifts.
      </>
    ),
  },
  {
    value: "what-does-it-do",
    q: "What exactly does LOJJ do for hotels like ours?",
    a: (
      <>
        <p className="mb-2">Two things:</p>
        <ul className="faq-answer-list">
          <li>
            It helps staff answer questions using your hotel training, policies, and procedures—guest FAQ
            automation your team can use in real time.
          </li>
          <li>
            It turns guest requests into hotel task tracking, so you can see what is assigned, in
            progress, and done across shifts.
          </li>
        </ul>
      </>
    ),
  },
  {
    value: "employee-example",
    q: "How would LOJJ help our front desk employees day to day?",
    a: (
      <>
        Picture a late checkout request, a confusing policy question, or a property specific rule.
        Instead of guessing or calling a manager, staff can pull up the right guidance right away.
        You get fewer front desk calls to managers, and guests get a faster, more consistent answer.
      </>
    ),
  },
  {
    value: "guest-example",
    q: "How does LOJJ improve the guest experience on the customer side?",
    a: (
      <>
        Guests get quicker answers and fewer runarounds. LOJJ can support hotel self service guest
        information and guest FAQ automation, so basic questions do not always turn into front desk
        phone calls. If a guest requests extra towels, an item is out of stock, or something needs
        attention, LOJJ turns it into a task for housekeeping or the right team, then tracks it until
        it is handled.
      </>
    ),
  },
  {
    value: "discovery-questions",
    q: "What do you need to know from us?",
    a: (
      <ul className="faq-answer-list">
        <li>How do you currently train new front desk or hotel staff?</li>
        <li>What are the most common mistakes new staff make?</li>
        <li>
          Do managers often get interrupted to answer the same questions repeatedly? If so, what do
          staff repeatedly ask you?
        </li>
        <li>Are there certain procedures at your property that are not written clearly anywhere?</li>
        <li>Would it be useful if staff had a quick place to check before calling a manager?</li>
      </ul>
    ),
  },
  {
    value: "fit-into-communication",
    q: "How would LOJJ fit into the way our team already communicates with guests?",
    a: (
      <>
        LOJJ is meant to sit alongside what you already do. It does not replace your guest messaging
        or your PMS. It helps staff answer questions using property specific guidance, then it routes
        requests into a hotel task management workflow so nothing gets missed between shifts.
      </>
    ),
  },
  {
    value: "demo",
    q: "We’re interested! What’s the best way to see a demo of LOJJ?",
    a: (
      <>
        A short demo is the fastest way. We will ask how you handle guest questions today, how you
        train new staff, and how requests move between shifts. Then we will show LOJJ working with
        guest FAQs and hotel task tracking, including housekeeping and work orders.
      </>
    ),
  },
  {
    value: "next-steps",
    q: "If we wanted to move forward, what would the next steps look like?",
    a: (
      <>
        Usually it goes like this. We do a demo, then you share what you want LOJJ to reflect: your
        policies, procedures, and common guest FAQs. After that, we set up a simple flow to capture
        requests and track tasks across shifts. We start with what causes the most noise at the front
        desk and what gets dropped most often, like housekeeping issues and work orders.
      </>
    ),
  },
  {
    value: "already-have-training",
    q: "We already have training processes in place. How would LOJJ fit into that?",
    a: (
      <>
        Most hotels already have training. LOJJ is not trying to replace it. It makes your existing
        training easier to use in the moment, especially when newer staff need a quick answer during
        a guest interaction.
      </>
    ),
  },
  {
    value: "not-interested",
    q: "We’re not sure this is something we need right now. Why would hotels use LOJJ instead of their current process?",
    a: (
      <>
        <p className="mb-2">
          Hotels usually look for something like LOJJ when the current process is wearing people down:
        </p>
        <ul className="faq-answer-list">
          <li>Too many repetitive guest questions</li>
          <li>Constant front desk calls to managers</li>
          <li>Requests that get lost between shifts</li>
        </ul>
        <p className="mt-3">
          LOJJ reduces front desk calls with guest FAQ automation and makes requests trackable, so service
          stays steady even when the front desk is understaffed or turnover is high.
        </p>
      </>
    ),
  },
  {
    value: "already-have-system",
    q: "We already have systems for guest requests and communication. How is LOJJ different?",
    a: (
      <>
        The main difference is the handoff. LOJJ focuses on property specific guidance in real time
        and the follow through after a request comes in. It is not trying to replace your PMS. It
        helps staff answer questions consistently, then it turns requests into clear tasks that do
        not get lost between shifts.
      </>
    ),
  },
  {
    value: "corporate-decides",
    q: "Corporate makes most of our technology decisions. How could a property like ours still use or explore LOJJ?",
    a: (
      <>
        That is common. The first step is figuring out what you can decide locally versus what needs
        brand approval, especially for staff training support and internal workflows. If corporate
        approval is required, we can give you a short overview and a demo you can forward to the
        right contact.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <main className="faq-page min-h-screen w-full flex justify-center pt-28 pb-24">
      <div className="w-[95%] max-w-4xl">
        <div className="section-heading-stack">
          <h1 className="landing-h2">Frequently Asked Questions</h1>
        </div>

        <p className="landing-sub mt-4">
          These are common questions we hear from hotel managers about training support for new
          staff, reducing front desk interruptions, and turning guest requests into trackable tasks.
        </p>

        <div className="mt-10">
          <Accordion type="single" collapsible defaultValue="what-does-it-do" className="max-w-3xl">
            {faqs.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
}

