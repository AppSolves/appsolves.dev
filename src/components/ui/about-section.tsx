const areas = [
  {
    index: "01",
    title: "AI & Deep Learning",
    description:
      "Computer vision, graph neural networks, model deployment, and the systems needed to move models into real environments.",
  },
  {
    index: "02",
    title: "Systems & Compilers",
    description:
      "Language tooling, compiler architecture, runtimes, native backends, and developer infrastructure with performance and correctness in mind.",
  },
  {
    index: "03",
    title: "Products",
    description:
      "End-to-end software, from architecture and interface design to deployment, monetization, and maintaining products after launch.",
  },
  {
    index: "04",
    title: "Physical AI",
    description:
      "Robotics, edge compute, sensors, and intelligent systems that have to work outside a notebook and under real constraints.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="mr-4 text-foreground">02</span>
            About
          </div>

          <div>
            <h2 className="max-w-5xl text-[clamp(2.5rem,5vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.055em] text-foreground">
              Engineering across layers, from models to machines to products.
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-8 text-base leading-7 text-muted-foreground md:grid-cols-2 md:text-lg md:leading-8">
              <p>
                I&apos;m Kaan Gönüldinc, a Computer Science student at the
                Technical University of Munich and the builder behind
                AppSolves. I like working on problems where software
                architecture, machine intelligence, and product thinking meet.
              </p>
              <p>
                The common thread is depth. I want to understand the system,
                build the hard parts, and ship something real rather than stop
                at a prototype. That has led me from deep-learning traffic
                systems to compiler tooling, mobile products, and open-source
                infrastructure.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/[0.08]">
          {areas.map((area) => (
            <div
              key={area.index}
              className="grid grid-cols-[52px_1fr] gap-4 border-b border-white/[0.08] py-7 sm:grid-cols-[80px_0.8fr_1.2fr] sm:items-start sm:gap-8"
            >
              <div className="font-mono text-[10px] tracking-[0.16em] text-white/28">
                {area.index}
              </div>
              <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground sm:text-xl">
                {area.title}
              </h3>
              <p className="col-start-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:col-start-auto sm:text-base sm:leading-7">
                {area.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 border-y border-white/[0.08] sm:grid-cols-3">
          <div className="py-7 sm:border-r sm:border-white/[0.08] sm:pr-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              Education
            </div>
            <div className="mt-3 text-lg font-medium text-foreground">
              Computer Science @ TUM
            </div>
          </div>
          <div className="border-t border-white/[0.08] py-7 sm:border-r sm:border-t-0 sm:border-white/[0.08] sm:px-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              Recognition
            </div>
            <div className="mt-3 text-lg font-medium text-foreground">
              Ferry Porsche Prize 2026
            </div>
          </div>
          <div className="border-t border-white/[0.08] py-7 sm:border-t-0 sm:pl-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              Research competition
            </div>
            <div className="mt-3 text-lg font-medium text-foreground">
              Jugend forscht, 2nd Prize
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
