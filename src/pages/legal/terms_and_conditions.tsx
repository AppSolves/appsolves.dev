import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import termsText from "@legal/terms_and_conditions.md?raw";

export default function TermsAndConditions() {
  useEffect(() => {
    const previousTitle = document.title;
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    document.title = "Terms and conditions | AppSolves";
    if (canonical)
      canonical.href = "https://appsolves.dev/terms_and_conditions";
    return () => {
      document.title = previousTitle;
      if (canonical) canonical.href = "https://appsolves.dev/";
    };
  }, []);

  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1} className="legal-main prose prose-lg">
        <ReactMarkdown>{termsText}</ReactMarkdown>
      </main>
      <Footer />
    </>
  );
}
