import LandingPage from "@/components/LandingPage";
import { getSiteUrl, siteUrl } from "@/lib/site";

export default function Home() {
  const siteOrigin = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteOrigin}#org`,
        name: "LOJJ",
        url: siteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: siteUrl("/favicon.png"),
        },
        sameAs: ["https://www.linkedin.com/company/lojj"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteOrigin}#website`,
        url: siteUrl("/"),
        name: "LOJJ",
        inLanguage: "en",
        publisher: { "@id": `${siteOrigin}#org` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteOrigin}#app`,
        name: "LOJJ",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl("/"),
        description:
          "Digital concierge and hotel task management system to reduce front desk phone calls, automate guest FAQs, and track staff requests across shifts.",
        publisher: { "@id": `${siteOrigin}#org` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteOrigin}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I reduce front desk phone calls?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Give guests self-service information (FAQs, policies, hours, parking, Wi‑Fi) and a simple way to submit requests. LOJJ acts as a digital concierge so common questions get answered without a call.",
            },
          },
          {
            "@type": "Question",
            name: "What if my front desk is understaffed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "When staffing is tight, consistency matters more. LOJJ reduces interruptions by automating hotel guest FAQs and routing requests into clear tasks—so fewer issues bounce back to managers.",
            },
          },
          {
            "@type": "Question",
            name: "How can I track hotel staff tasks?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LOJJ keeps requests visible, assigned, and updated so you can see what’s in progress, what’s done, and what’s blocked without chasing radio calls.",
            },
          },
          {
            "@type": "Question",
            name: "Can guests access info via QR codes or self-service pages?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Many hotels use QR code guest information pages so guests can find answers quickly. LOJJ helps you structure and maintain that information so it stays current.",
            },
          },
        ],
      },
    ],
  } as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
