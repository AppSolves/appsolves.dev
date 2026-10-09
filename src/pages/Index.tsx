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
        for (const selector of [".lane-stage", ".tag-stage"]) {
          gsap.from(selector, {
            y: 20,
            opacity: 0.7,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: selector,
              start: "clamp(top 88%)",
              once: true,
            },
          });
        }
        for (const selector of [
          ".project-details > div",
          ".lane-overview > div",
          ".tag-project > .split-copy",
        ]) {
          gsap.utils
            .toArray<HTMLElement>(selector, page.current)
            .forEach((element, index) => {
              gsap.from(element, {
                y: 18,
                opacity: 0.7,
                duration: 0.7,
                delay: index * 0.08,
                ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: element,
                  start: "clamp(top 88%)",
                  once: true,
                },
              });
            });
        }
        // A few distinct arrivals; content is readable even before each reveal.
        for (const selector of [
          ".section-heading",
          ".contact-composition h2",
        ]) {
          gsap.from(selector, {
            y: 16,
            opacity: 0.7,
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
        gsap.from(".recognition-list > div", {
          opacity: 0.65,
          duration: 0.45,
          stagger: 0.07,
          ease: "power1.out",
          clearProps: "opacity",
          scrollTrigger: {
            trigger: ".recognition-list",
            start: "clamp(top 90%)",
            once: true,
          },
        });
        gsap.utils
          .toArray<HTMLElement>(".source-list li", page.current)
          .forEach((row) => {
            gsap.from(row, {
              x: 12,
              opacity: 0.65,
              duration: 0.5,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: row,
                start: "clamp(top 92%)",
                once: true,
              },
            });
          });
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
