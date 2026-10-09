import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import PageMetadata from "@/components/PageMetadata";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import impressumText from "@legal/impressum.md?raw";

export default function Impressum() {
  return (
    <>
      <PageMetadata
        title="Impressum"
        description="Anbieterkennzeichnung und Kontaktangaben von Kaan Gönüldinc, AppSolves."
        path="/impressum"
      />
      <Navigation />
      <main
        id="main"
        tabIndex={-1}
        className="legal-main prose prose-lg"
        lang="de"
      >
        <ReactMarkdown
          components={{
            a: ({ href, children }) =>
              href?.startsWith("/") ? (
                <Link to={href}>{children}</Link>
              ) : (
                <a href={href}>{children}</a>
              ),
          }}
        >
          {impressumText}
        </ReactMarkdown>
      </main>
      <Footer />
    </>
  );
}
