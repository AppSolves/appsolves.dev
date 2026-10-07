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

  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-11, 11]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });

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
      className="relative mx-auto aspect-square w-full max-w-[560px] [perspective:1400px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        className="absolute inset-[8%] [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        <div className="absolute inset-[8%] border border-white/[0.06] [transform:translateZ(-90px)]" />
        <div className="absolute inset-[15%] border border-white/[0.09] [transform:translateZ(-42px)_rotate(8deg)]" />
        <div className="absolute inset-[21%] border border-white/[0.12] [transform:translateZ(4px)_rotate(-6deg)]" />

        <motion.div
          className="absolute inset-[20%] grid place-items-center [transform:translateZ(72px)]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        >
          <img
            src="/mark.svg"
            alt="AppSolves"
            className="h-auto w-full select-none drop-shadow-[0_28px_35px_rgba(0,0,0,0.38)]"
            draggable={false}
          />
        </motion.div>

        <div className="absolute left-[4%] top-[4%] font-mono text-[10px] uppercase tracking-[0.22em] text-white/28 [transform:translateZ(18px)]">
          AS / 26
        </div>
        <div className="absolute bottom-[7%] right-[3%] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/28 [transform:translateZ(18px)]">
          systems
          <br />
          intelligence
          <br />
          products
        </div>
        <div className="absolute bottom-[2%] left-[8%] h-px w-[44%] bg-white/12 [transform:translateZ(18px)]" />
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-20">
      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-10 lg:py-24">
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
          className="relative lg:pl-4"
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
