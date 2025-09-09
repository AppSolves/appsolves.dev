import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
      <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-grow flex flex-col items-center justify-center pt-20">
        <div className="text-center flex flex-col items-center flex-grow justify-center">
          <h1 className="mb-4 text-6xl font-bold">404</h1>
          <p className="mb-6 text-2xl text-gray-400">Oops! Page not found</p>
          <br></br>
          <Button variant="default" size="lg" className="group flex items-center" onClick={() => {
              if (document.referrer) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}>
            <StepBack className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1 mt-[0.175rem]" />
            Go Back
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
