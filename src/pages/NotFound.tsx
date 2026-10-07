import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const title = document.title;
    const robots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    const previousRobots = robots?.content;
    const misleading = [
      ...document.querySelectorAll(
        'link[rel="canonical"],meta[property="og:url"],meta[name="googlebot"],meta[name="bingbot"]',
      ),
    ];
    misleading.forEach((element) => element.remove());
    if (robots) robots.content = "noindex, follow";
    document.title = "Page not found | AppSolves";
    return () => {
      document.title = title;
      if (robots && previousRobots) robots.content = previousRobots;
      misleading.forEach((element) => document.head.appendChild(element));
    };
  }, []);
  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1} className="page-width not-found">
        <h1>404</h1>
        <p>There’s no page at this address.</p>
        <a className="text-link" href={import.meta.env.BASE_URL}>
          <ArrowLeft size={18} aria-hidden="true" /> Back to AppSolves
        </a>
      </main>
      <Footer />
    </>
  );
}
