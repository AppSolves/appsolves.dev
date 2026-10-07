import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";

const HeroObject = () => {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-7, 7]), {
    stiffness: 110,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [5, -5]), {
    stiffness: 110,
    damping: 20,
  });
  const lightX = useTransform(pointerX, [-1, 1], ["34%", "72%"]);
  const lightY = useTransform(pointerY, [-1, 1], ["32%", "68%"]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className="hero-object-wrap"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        className="hero-object"
        style={{ rotateX, rotateY }}
      >
        <div className="hero-object-shadow" />
        <div className="hero-object-depth hero-object-depth-back" />
        <div className="hero-object-depth hero-object-depth-mid" />

        <div className="hero-object-face">
          <motion.div
            className="hero-object-light"
            style={{ left: lightX, top: lightY }}
          />
          <div className="hero-object-edge" />
          <div className="hero-object-inner">
            <div className="hero-object-mark-wrap">
              <img
                src="/mark.svg"
                alt="AppSolves"
                className="hero-object-mark"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-20">
      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10 lg:py-24">
        <div className="relative z-10">
          <div className="mb-9 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-foreground">01</span>
            <span className="h-px w-12 bg-white/18" />
            <span>Kaan Gönüldinc / AppSolves</span>
          </div>

          <motion.h1
            className="max-w-[900px] text-[clamp(3.3rem,7.2vw,7.8rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-foreground"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            AI systems, developer infrastructure, and products.
          </motion.h1>

          <motion.p
            className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Computer Science at TUM. Creator of Fidan. I work across deep
            learning, compilers, edge AI, and product engineering to turn
            ambitious technical ideas into real systems.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 border-b border-foreground/45 pb-1 text-sm font-medium text-foreground transition-colors hover:border-foreground"
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
          </motion.div>

          <div className="mt-16 grid max-w-2xl grid-cols-1 gap-6 border-t border-white/[0.08] pt-6 sm:grid-cols-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Based at
              </div>
              <div className="mt-2 text-sm text-foreground">TUM, Munich</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Focus
              </div>
              <div className="mt-2 text-sm text-foreground">AI / Systems</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Building
              </div>
              <div className="mt-2 text-sm text-foreground">Fidan / AppSolves</div>
            </div>
          </div>
        </div>

        <motion.div
          className="relative lg:pl-8"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroObject />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
