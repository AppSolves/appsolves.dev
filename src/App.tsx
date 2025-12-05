import { Button } from "@/components/ui/button";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/legal/privacy_policy";
import TermsAndConditions from "./pages/legal/terms_and_conditions";

const basePath = import.meta.env.VITE_BASE_URL || "/";
const queryClient = new QueryClient();

const App = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path={basePath} element={<Index />} />
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
            <Route path="/terms_and_conditions" element={<TermsAndConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* Bottom Right Actions */}
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 transition-opacity duration-300 z-50 ${showButton ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <a href="https://www.buymeacoffee.com/AppSolves" target="_blank" rel="noopener noreferrer">
            <img
              style={{
                height: "40px", width: "auto", pointerEvents: "none",
                WebkitUserDrag: "none",
                userSelect: "none",
                MozUserSelect: "none",
                WebkitUserSelect: "none", msUserSelect: "none",
              } as React.CSSProperties}
              alt="Buy Me A Coffee"
              src="/bmc-button.png"
              draggable="false"
            />
          </a>

          <Button
            onClick={scrollToTop}
            className="group items-center p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
          </Button>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
