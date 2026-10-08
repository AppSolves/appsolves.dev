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
          x: 18,
          opacity: 0.7,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".fidan-stage",
            start: "top 80%",
            once: true,
          },
        });
        gsap.from(".lane-stage", {
          scale: 0.99,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".lane-stage",
            start: "top 85%",
            once: true,
          },
        });
        // A few distinct arrivals; content is readable even before each reveal.
        for (const selector of [
          ".section-heading",
          ".contact-composition h2",
        ]) {
          gsap.from(selector, {
            y: 16,
            opacity: 0.75,
            duration: 0.65,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: selector,
              start: "clamp(top 88%)",
              once: true,
            },
          });
        }
        gsap.from(".about-title", {
          x: -16,
          opacity: 0.8,
          duration: 0.65,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".about-composition",
            start: "clamp(top 88%)",
            once: true,
          },
        });
        for (const selector of [".recognition-list > div", ".source-list li"]) {
          gsap.from(selector, {
            opacity: 0.65,
            duration: 0.45,
            stagger: 0.07,
            ease: "power1.out",
            clearProps: "opacity",
            scrollTrigger: {
              trigger: selector,
              start: "clamp(top 90%)",
              once: true,
            },
          });
        }
      });
      let active = true;
      document.fonts.ready.then(() => {
        if (active) {
          ScrollTrigger.refresh();
          // Native hash navigation can run before the client-rendered targets exist.
          if (location.hash)
            document
              .getElementById(location.hash.slice(1))
              ?.scrollIntoView({ behavior: "instant" });
        }
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
