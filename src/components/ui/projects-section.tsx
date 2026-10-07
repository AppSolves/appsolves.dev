import { ArrowUpRight, Github } from "lucide-react";

interface FeaturedProject {
  title: string;
  category: string;
  description: string;
  detail: string;
  tech: string[];
  href: string;
  source?: string;
}

const featured: FeaturedProject[] = [
  {
    title: "Fidan",
    category: "Language / Compiler / AI tooling",
    description:
      "An AI-native general-purpose programming language and compiler toolchain built in Rust.",
    detail:
      "Typed HIR and MIR, static type checking, an interpreter, Cranelift JIT/AOT, optional LLVM AOT, an LSP, package tooling, concurrency primitives, and compiler-grounded AI workflows.",
    tech: ["Rust", "Cranelift", "LLVM", "JIT/AOT", "LSP"],
    href: "https://fidan.dev",
    source: "https://github.com/fidan-lang/fidan",
  },
  {
    title: "LanePilot",
    category: "Deep learning / Edge AI / Intelligent systems",
    description:
      "A real-time traffic intelligence system combining computer vision, graph-based optimization, and edge deployment.",
    detail:
      "Lane and vehicle perception with YOLO11n-seg, graph-based traffic optimization with PyTorch Geometric / GATv2, and deployment work across NVIDIA Jetson, TensorRT, and Raspberry Pi.",
    tech: ["PyTorch", "GATv2", "TensorRT", "CUDA", "Jetson"],
    href: "https://github.com/AppSolves/LanePilot",
    source: "https://github.com/AppSolves/LanePilot",
  },
  {
    title: "TagVault",
    category: "Product / Mobile / NFC",
    description:
      "A shipped Android product for securely managing, writing, and automating NFC and RFID tags.",
    detail:
      "Designed and built end to end with encrypted local storage, biometric protection, NFC workflows, webhooks, widgets, backups, and a paid Pro tier.",
    tech: ["Flutter", "Android", "NFC", "Security", "Automation"],
    href: "https://tagvault.appsolves.dev",
  },
];

const secondary = [
  ["fastapi-users-db-dynamodb", "Async DynamoDB database adapter for FastAPI Users.", "Python / AWS / Open source", "https://github.com/AppSolves/fastapi-users-db-dynamodb"],
  ["rc522-mfc-recovery", "Research toolkit for MIFARE Classic key recovery with Raspberry Pi and MFRC522 hardware.", "Python / Hardware / Security research", "https://github.com/AppSolves/rc522-mfc-recovery"],
  ["pylocalauth", "Cross-platform local authentication library for Python applications.", "Python / Native auth / Open source", "https://github.com/AppSolves/pylocalauth"],
  ["flutter_event_log", "Flutter plugin exposing the native Windows Event Log API.", "Flutter / C++ / Windows", "https://github.com/AppSolves/flutter_event_log"],
  ["appscreen-mcp", "MCP tooling for automating App Store screenshot workflows.", "TypeScript / MCP / Automation", "https://github.com/AppSolves/appscreen-mcp"],
];

const ProjectsSection = () => {
  return (
    <section id="work" className="border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="section-kicker">Selected work</div>
        <h2 className="mt-10 max-w-5xl text-[clamp(2.8rem,5.5vw,6.4rem)] font-medium leading-[0.96] tracking-[-0.06em] text-foreground">
          A few projects that show the range of what I build.
        </h2>

        <div className="mt-20 border-t border-white/[0.08]">
          {featured.map((project) => (
            <article key={project.title} className="project-row group">
              <div className="project-row-meta">{project.category}</div>

              <div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-3"
                >
                  <h3 className="project-title">{project.title}</h3>
                  <ArrowUpRight className="mt-2 h-5 w-5 text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                </a>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/85">
                  {project.description}
                </p>
              </div>

              <div className="space-y-7">
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  {project.detail}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.12em] text-white/35">
                  {project.tech.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                {project.source && (
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div>
            <div className="section-kicker">More engineering</div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Open-source libraries, developer tooling, and narrower technical
              work that supports the larger projects.
            </p>
          </div>

          <div className="border-t border-white/[0.08]">
            {secondary.map(([title, description, meta, href]) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="engineering-row group"
              >
                <div className="text-base font-medium tracking-[-0.02em] text-foreground">
                  {title}
                </div>
                <div className="text-sm leading-6 text-muted-foreground">
                  {description}
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-white/28">
                    {meta}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/28 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
