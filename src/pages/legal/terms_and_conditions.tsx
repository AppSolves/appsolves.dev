import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import PageMetadata from "@/components/PageMetadata";
import ReactMarkdown from "react-markdown";
import termsText from "@legal/terms_and_conditions.md?raw";

export default function TermsAndConditions() {
  return (
    <>
      <PageMetadata
        title="Terms and conditions"
        description="Terms and conditions for AppSolves services."
        path="/terms_and_conditions"
      />
      <Navigation />
      <main id="main" tabIndex={-1} className="legal-main prose prose-lg">
        <ReactMarkdown>{termsText}</ReactMarkdown>
      </main>
      <Footer />
    </>
  );
}
