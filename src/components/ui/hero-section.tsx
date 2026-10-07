import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[94svh] items-end overflow-hidden pt-24">
      <div className="hero-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1480px] px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Kaan Gönüldinc / AppSolves
          </div>

          <h1 className="mt-8 max-w-[1280px] text-[clamp(4.2rem,8.7vw,9.6rem)] font-medium leading-[0.9] tracking-[-0.075em] text-foreground">
            Building software across intelligence, systems, and products.
          </h1>

          <div className="mt-12 grid gap-10 border-t border-white/[0.08] pt-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
              Computer Science at TUM. Creator of Fidan. I work across deep
              learning, compilers, edge AI, developer infrastructure, and
              product engineering to turn ambitious technical ideas into real
              systems.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                Selected work
                <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <a
                href="https://github.com/AppSolves"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
