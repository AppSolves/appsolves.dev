import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import AboutSection from "@/components/ui/about-section";
import ProjectsSection from "@/components/ui/projects-section";
import Footer from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
