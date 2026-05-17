import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers for hotel managers on reducing front desk phone calls, guest FAQ automation, understaffed front desk workload, hotel task tracking, and hotel operations software.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <main className="faq-page min-h-screen w-full flex justify-center pt-28 pb-24">
      <div className="w-[95%] max-w-4xl">
        <div className="section-heading-stack">
          <h1 className="landing-h2">Frequently Asked Questions</h1>
        </div>

        <p className="landing-sub mt-4">
          Common questions from hotel managers searching for how to reduce front desk phone calls,
          hotel guest FAQ automation, understaffed front desk solutions, and hotel task management
          systems—answered in plain language.
        </p>

        <div className="mt-10">
          <Accordion type="single" collapsible defaultValue="reduce-calls" className="max-w-3xl">
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
