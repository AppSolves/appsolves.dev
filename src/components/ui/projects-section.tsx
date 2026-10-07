import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

type ProjectKind = "fidan" | "lane" | "tagvault";

interface FeaturedProject {
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  tech: string[];
  href: string;
  source?: string;
  kind: ProjectKind;
}

const featured: FeaturedProject[] = [
  {
    index: "01",
    title: "Fidan",
    eyebrow: "Language / Compiler / AI tooling",
    description:
      "An AI-native general-purpose programming language and compiler toolchain built in Rust.",
    detail:
      "Typed HIR and MIR, static type checking, an interpreter, Cranelift JIT/AOT, optional LLVM AOT, an LSP, package tooling, concurrency primitives, and compiler-grounded AI workflows.",
    tech: ["Rust", "Cranelift", "LLVM", "JIT/AOT", "LSP"],
    href: "https://fidan.dev",
    source: "https://github.com/fidan-lang/fidan",
    kind: "fidan",
  },
  {
    index: "02",
    title: "LanePilot",
    eyebrow: "Deep learning / Edge AI / Intelligent systems",
    description:
      "A real-time traffic intelligence system combining computer vision, graph-based optimization, and edge deployment.",
    detail:
      "Lane and vehicle perception with YOLO11n-seg, graph-based traffic optimization with PyTorch Geometric / GATv2, and deployment work across NVIDIA Jetson, TensorRT, and Raspberry Pi.",
    tech: ["PyTorch", "GATv2", "TensorRT", "CUDA", "Jetson"],
    href: "https://github.com/AppSolves/LanePilot",
    source: "https://github.com/AppSolves/LanePilot",
    kind: "lane",
  },
  {
    index: "03",
    title: "TagVault",
    eyebrow: "Product / Mobile / NFC",
    description:
      "A shipped Android product for securely managing, writing, and automating NFC and RFID tags.",
    detail:
      "Designed and built end to end with encrypted local storage, biometric protection, NFC workflows, webhooks, widgets, backups, and a paid Pro tier.",
    tech: ["Flutter", "Android", "NFC", "Security", "Automation"],
    href: "https://tagvault.appsolves.dev",
    kind: "tagvault",
  },
];

const secondary = [
  {
    title: "fastapi-users-db-dynamodb",
    description: "Async DynamoDB database adapter for FastAPI Users.",
    href: "https://github.com/AppSolves/fastapi-users-db-dynamodb",
    meta: "Python / AWS / Open source",
  },
  {
    title: "rc522-mfc-recovery",
    description:
      "Reproducible research toolkit for MIFARE Classic key recovery using Raspberry Pi and MFRC522 hardware.",
    href: "https://github.com/AppSolves/rc522-mfc-recovery",
    meta: "Python / Hardware / Security research",
  },
  {
    title: "pylocalauth",
    description:
      "Cross-platform local authentication library for Python applications.",
    href: "https://github.com/AppSolves/pylocalauth",
    meta: "Python / Native auth / Open source",
  },
  {
    title: "flutter_event_log",
    description:
      "Flutter plugin exposing the native Windows Event Log API.",
    href: "https://github.com/AppSolves/flutter_event_log",
    meta: "Flutter / C++ / Windows",
  },
  {
    title: "appscreen-mcp",
    description:
      "MCP tooling for generating and automating App Store screenshot workflows.",
    href: "https://github.com/AppSolves/appscreen-mcp",
    meta: "TypeScript / MCP / Automation",
  },
];

const ProjectVisual = ({ kind }: { kind: ProjectKind }) => {
  if (kind === "fidan") {
    return (
      <div className="project-visual project-visual-fidan">
        <div className="fidan-axis" />
        <div className="fidan-plane fidan-plane-a" />
        <div className="fidan-plane fidan-plane-b" />
        <div className="fidan-plane fidan-plane-c" />
        <div className="fidan-code">
          <div>source</div>
          <span>→</span>
          <div>HIR</div>
          <span>→</span>
          <div>MIR</div>
          <span>→</span>
          <div>native</div>
        </div>
        <div className="visual-caption">
          compiler pipeline / multi-backend execution
        </div>
      </div>
    );
  }

  if (kind === "lane") {
    return (
      <div className="project-visual project-visual-lane">
        <div className="lane-horizon" />
        <div className="lane-line lane-line-a" />
        <div className="lane-line lane-line-b" />
        <div className="lane-line lane-line-c" />
        <div className="lane-node lane-node-a" />
        <div className="lane-node lane-node-b" />
        <div className="lane-node lane-node-c" />
        <div className="lane-node lane-node-d" />
        <div className="lane-scan" />
        <div className="visual-caption">perception / graph optimization / edge</div>
      </div>
    );
  }

  return (
    <div className="project-visual project-visual-tagvault">
      <div className="tagvault-card">
        <div className="tagvault-mark">TV</div>
        <div className="tagvault-meta">NFC / SECURE / LOCAL</div>
      </div>
      <div className="nfc-wave nfc-wave-a" />
      <div className="nfc-wave nfc-wave-b" />
      <div className="nfc-wave nfc-wave-c" />
      <div className="visual-caption">scan / store / automate</div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="work" className="border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="mr-4 text-foreground">03</span>
            Selected work
          </div>
          <div>
            <h2 className="max-w-5xl text-[clamp(2.5rem,5vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.055em] text-foreground">
              A few projects that show how I think and build.
            </h2>
          </div>
        </div>

        <div className="mt-20">
          {featured.map((project, index) => (
            <article
              key={project.title}
              className="grid grid-cols-1 gap-10 border-t border-white/[0.08] py-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16 lg:py-20"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Project {project.index}
                </div>
                <div className="mt-7 hidden text-sm text-muted-foreground lg:block">
                  {project.eyebrow}
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 gap-9 xl:grid-cols-[0.78fr_1.22fr] xl:items-start xl:gap-12">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 lg:hidden">
                      {project.eyebrow}
                    </div>
                    <h3 className="mt-2 text-[clamp(2.5rem,5.2vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.055em] text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-7 text-lg leading-8 text-foreground/82">
                      {project.description}
                    </p>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {project.detail}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/35">
                      {project.tech.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

                    <div className="mt-9 flex flex-wrap gap-6">
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 border-b border-foreground/45 pb-1 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                      >
                        Open project
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                      {project.source && (
                        <a
                          href={project.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Github className="h-4 w-4" />
                          Source
                        </a>
                      )}
                    </div>
                  </div>

                  <motion.a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.div
                      variants={{
                        rest: { y: 0 },
                        hover: { y: -5 },
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProjectVisual kind={project.kind} />
                    </motion.div>
                  </motion.a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/[0.08] pt-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              More engineering
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Open-source libraries, developer tooling, and narrower technical
              projects that support the larger work.
            </p>
          </div>

          <div className="border-t border-white/[0.08]">
            {secondary.map((project) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[1fr_auto] gap-4 border-b border-white/[0.08] py-6 sm:grid-cols-[0.75fr_1.25fr_auto] sm:items-center"
              >
                <div className="text-base font-medium tracking-[-0.02em] text-foreground">
                  {project.title}
                </div>
                <div className="col-span-2 text-sm leading-6 text-muted-foreground sm:col-span-1">
                  {project.description}
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-white/28">
                    {project.meta}
                  </span>
                </div>
                <ArrowUpRight className="row-start-1 h-4 w-4 text-white/35 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground sm:row-auto" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
