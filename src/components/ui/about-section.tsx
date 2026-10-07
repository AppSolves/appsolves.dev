const areas = [
  {
    title: "AI & Deep Learning",
    description:
      "Computer vision, graph neural networks, model deployment, and the infrastructure around intelligent systems.",
  },
  {
    title: "Systems & Compilers",
    description:
      "Language tooling, compiler architecture, runtimes, native backends, and developer infrastructure.",
  },
  {
    title: "Products",
    description:
      "End-to-end software, from architecture and interface design to deployment, monetization, and maintenance.",
  },
  {
    title: "Physical AI",
    description:
      "Edge compute, robotics, sensors, and intelligent systems that have to work under real-world constraints.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="section-kicker">About</div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <h2 className="max-w-4xl text-[clamp(2.8rem,5.2vw,6rem)] font-medium leading-[0.97] tracking-[-0.06em] text-foreground">
            I care about the hard part: making ambitious ideas actually work.
          </h2>

          <div className="grid gap-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            <p>
              I&apos;m Kaan Gönüldinc, a Computer Science student at the
              Technical University of Munich and the builder behind AppSolves.
              I like working where machine intelligence, software architecture,
              and product thinking meet.
            </p>
            <p>
              The common thread is depth. I want to understand the system,
              build the difficult parts, and ship something real instead of
              stopping at a prototype.
            </p>
          </div>
        </div>

        <div className="mt-20 grid border-y border-white/[0.08] sm:grid-cols-3">
          <div className="py-7 sm:pr-8">
            <div className="fact-label">Education</div>
            <div className="mt-3 text-lg text-foreground">Computer Science @ TUM</div>
          </div>
          <div className="border-t border-white/[0.08] py-7 sm:border-l sm:border-t-0 sm:border-white/[0.08] sm:px-8">
            <div className="fact-label">Recognition</div>
            <div className="mt-3 text-lg text-foreground">Ferry Porsche Prize 2026</div>
          </div>
          <div className="border-t border-white/[0.08] py-7 sm:border-l sm:border-t-0 sm:border-white/[0.08] sm:pl-8">
            <div className="fact-label">Research competition</div>
            <div className="mt-3 text-lg text-foreground">Jugend forscht, 2nd Prize</div>
          </div>
        </div>

        <div className="mt-20 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {areas.map((area) => (
            <div key={area.title} className="border-t border-white/[0.08] pt-6">
              <h3 className="text-2xl font-medium tracking-[-0.035em] text-foreground">
                {area.title}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
