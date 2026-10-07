import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import privacyText from "@legal/privacy_policy.md?raw";

export default function PrivacyPolicy() {
  useEffect(() => {
    const previousTitle = document.title;
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    document.title = "Privacy policy | AppSolves";
    if (canonical) canonical.href = "https://appsolves.dev/privacy_policy";
    return () => {
      document.title = previousTitle;
      if (canonical) canonical.href = "https://appsolves.dev/";
    };
  }, []);

  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1} className="legal-main prose prose-lg">
        <ReactMarkdown>{privacyText}</ReactMarkdown>
      </main>
      <Footer />
    </>
  );
}
