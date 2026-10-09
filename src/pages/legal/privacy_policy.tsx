import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import PageMetadata from "@/components/PageMetadata";
import ReactMarkdown from "react-markdown";
import privacyText from "@legal/privacy_policy.md?raw";

export default function PrivacyPolicy() {
  return (
    <>
      <PageMetadata
        title="Privacy policy"
        description="Privacy information for AppSolves websites, products and the contact form."
        path="/privacy_policy"
      />
      <Navigation />
      <main id="main" tabIndex={-1} className="legal-main prose prose-lg">
        <ReactMarkdown>{privacyText}</ReactMarkdown>
      </main>
      <Footer />
    </>
  );
}
