import LandingPage from "@/components/LandingPage";
import { faqs } from "@/lib/faqs";
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
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
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
