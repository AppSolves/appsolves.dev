import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function MarkdownSkeleton() {
  return (
    <div className="animate-pulse space-y-4 not-prose">
      <div className="h-10 w-2/3 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-5/6 rounded bg-muted" />
      <div className="h-4 w-4/6 rounded bg-muted" />

      <div className="h-7 w-1/2 rounded bg-muted mt-10" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-11/12 rounded bg-muted" />
      <div className="h-4 w-3/4 rounded bg-muted" />

      <div className="h-7 w-1/3 rounded bg-muted mt-10" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
    </div>
  );
}

export default function TermsAndConditions() {
  const [tacText, setTacText] = useState<string | null>(null);

  useEffect(() => {
    fetch("/legal/terms_and_conditions.md")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load terms and conditions");
        }

        return res.text();
      })
      .then(setTacText)
      .catch((error) => {
        console.error(error);
        setTacText("# Terms and Conditions\n\nCould not load terms and conditions.");
      });
  }, []);

  return (
    <div className="dark min-h-screen bg-background">
      <Navigation />
      <main className="prose prose-lg dark:prose-invert mx-auto pt-16 px-8 [@media(min-width:655px)]:px-0 mt-20 mb-16 transition-all duration-300 min-h-[60vh]">
        {tacText === null ? (
          <MarkdownSkeleton />
        ) : (
          <ReactMarkdown>{tacText}</ReactMarkdown>
        )}
      </main>
      <Footer />
    </div>
  );
}
