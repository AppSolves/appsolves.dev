import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import AboutSection from "@/components/ui/about-section";
import ProjectsSection from "@/components/ui/projects-section";
import OpenSourceSection from "@/components/open-source-section";
import Footer from "@/components/ui/footer";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Index = () => {
  const page = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out", clearProps: "all" } })
          .from(".hero-intro", { opacity: 0, duration: 0.6 }, 0)
          .from(
            ".hero-line",
            { yPercent: 110, duration: 0.85, stagger: 0.09 },
            0,
          )
          .from(
            ".hero-description, .hero-actions",
            { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 },
            0.18,
          );
        gsap.from(".fidan-specimen", {
          x: 24,
          opacity: 0.4,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".fidan-stage",
            start: "top 80%",
            once: true,
          },
        });
        for (const selector of [".lane-crop", ".tag-screens"])
          gsap.from(selector, {
            scale: 1.025,
            duration: 1.1,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: { trigger: selector, start: "top 85%", once: true },
          });
      });
      let active = true;
      document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
      return () => {
        active = false;
        media.revert();
      };
    },
    { scope: page },
  );

  return (
    <div ref={page}>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <OpenSourceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
