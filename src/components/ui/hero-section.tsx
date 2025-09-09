import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import TypingText from "./typing-text";
import { useScrollTriggered } from "@/hooks/use-scroll-triggered";

const HeroSection = () => {
  const { elementRef, isVisible } = useScrollTriggered({ threshold: 0.2 });

  return (
    <section ref={elementRef} className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <TypingText
              text="You've arrived. Now explore."
              startTyping={isVisible}
              speed={80}
              className="text-2xl sm:text-3xl font-semibold text-primary/80 tracking-wide"
            />
          </div>
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-hero-text tracking-tight transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Full-Stack Developer & Deep Learning Engineer
          </h1>
          <p className={`mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Building modern AI applications with clean code and thoughtful design. 
            Passionate about creating exceptional user experiences across all platforms.
          </p>
          
          <div className={`mt-10 flex items-center justify-center gap-x-6 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button variant="default" size="lg" className="group flex items-center" onClick={() => {
                const section = document.getElementById("projects-section");
                section?.scrollIntoView({ behavior: "smooth" });
              }}>
              View My Work
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 mt-[0.175rem]" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;