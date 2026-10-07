import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const title = document.title;
    document.title = "Page not found | AppSolves";
    return () => {
      document.title = title;
    };
  }, []);
  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1} className="page-width not-found">
        <h1>404</h1>
        <p>There’s no page at this address.</p>
        <a className="text-link" href={import.meta.env.BASE_URL}>
          Back to AppSolves <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </main>
      <Footer />
    </>
  );
}
