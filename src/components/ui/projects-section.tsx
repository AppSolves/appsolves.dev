import TagVaultScene from "@/components/tagvault/TagVaultScene";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const base = import.meta.env.BASE_URL;

export default function ProjectsSection() {
  const source = useRef<HTMLPreElement>(null);
  const [sourceOverflows, setSourceOverflows] = useState(false);
  useEffect(() => {
    const element = source.current;
    if (!element) return;
    const measure = () =>
      setSourceOverflows(element.scrollWidth > element.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="work"
      className="selected-work page-width"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <p className="section-label">Selected work</p>
        <h2 id="work-title">
          A language, a traffic system,
          <br />
          <span>and an Android app.</span>
        </h2>
      </div>

      <article
        id="fidan"
        className="project fidan-project"
        aria-labelledby="fidan-title"
      >
        <div className="fidan-stage">
          <div className="fidan-identity">
            <span className="project-number">01 / Language & compiler</span>
            <div className="fidan-lockup">
              <img
                src={`${base}images/fidan-icon.webp`}
                alt=""
                width="256"
                height="256"
                loading="lazy"
                decoding="async"
              />
              <span className="fidan-wordmark">Fidan</span>
            </div>
          </div>
          <div className="fidan-specimen">
            <span className="specimen-label">Fidan source</span>
            <div className="fidan-editor">
              <div className="code-line-numbers" aria-hidden="true">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <pre
                ref={source}
                tabIndex={0}
                aria-label="Fidan language example"
                aria-describedby={
                  sourceOverflows ? "fidan-scroll-hint" : undefined
                }
              >
                <code>
                  <span className="syntax-keyword">action</span>{" "}
                  <span className="syntax-function">greet</span>{" "}
                  <span className="syntax-keyword">with</span>{" "}
                  <span className="syntax-punctuation">(</span>
                  <span className="syntax-keyword">certain</span>{" "}
                  <span className="syntax-identifier">name</span>{" "}
                  <span className="syntax-keyword">oftype</span>{" "}
                  <span className="syntax-type">string</span>
                  <span className="syntax-punctuation">)</span>{" "}
                  <span className="syntax-keyword">returns</span>{" "}
                  <span className="syntax-type">string</span>{" "}
                  <span className="syntax-punctuation">{"{"}</span>
                  {"\n    "}
                  <span className="syntax-keyword">return</span>{" "}
                  <span className="syntax-string">
                    {'"Hello, '}
                    <span className="syntax-interpolation">{"{name}"}</span>
                    {'!"'}
                  </span>
                  {"\n"}
                  <span className="syntax-punctuation">{"}"}</span>
                  {"\n\n"}
                  <span className="syntax-function">print</span>
                  <span className="syntax-punctuation">(</span>
                  <span className="syntax-function">greet</span>
                  <span className="syntax-punctuation">(</span>
                  <span className="syntax-string">{'"Fidan"'}</span>
                  <span className="syntax-punctuation">))</span>
                </code>
              </pre>
            </div>
            {sourceOverflows && (
              <span id="fidan-scroll-hint" className="code-scroll-hint">
                Scroll horizontally
              </span>
            )}
          </div>
        </div>
        <div className="project-details">
          <div>
            <p className="project-category">
              AI-native language & compiler toolchain
            </p>
            <h3 id="fidan-title">Fidan</h3>
            <div className="project-links">
              <a
                className="text-link"
                href="https://fidan.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Fidan{" "}
                <ArrowUpRight
                  data-arrow-motion="external"
                  size={17}
                  aria-hidden="true"
                />
              </a>
              <a
                className="text-link secondary-link"
                href="https://github.com/fidan-lang/fidan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code{" "}
                <ArrowUpRight
                  data-arrow-motion="external"
                  size={17}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
          <div className="project-description">
            <p className="project-lead">
              Fidan is a general-purpose programming language and compiler
              toolchain I’m developing in Rust.
            </p>
            <p>
              The compiler uses typed HIR and MIR for static checking and
              execution through an interpreter or selective Cranelift JIT.
              Cranelift AOT and an optional LLVM AOT backend compile programs to
              native binaries.
            </p>
            <p>
              The toolchain includes a language server, package tooling, and
              concurrency support. Its AI assistance uses compiler diagnostics
              and type information to explain code and suggest changes.
            </p>
            <p className="project-tech">Rust / Cranelift / LLVM / LSP</p>
          </div>
        </div>
      </article>

      <article
        id="lanepilot"
        className="project split-project lane-project"
        aria-labelledby="lanepilot-title"
      >
        <div className="split-copy">
          <p className="project-category">02 / Deep learning & edge AI</p>
          <h3 id="lanepilot-title">LanePilot</h3>
          <p className="project-lead">
            Adaptive traffic management with edge AI.
          </p>
          <p>
            LanePilot investigates how changing lane assignments can reduce
            congestion. Cameras detect and track vehicles, estimate their
            movement, and provide the state used to recommend lane changes.
          </p>
          <p>
            Perception uses YOLO11n-seg and PyTorch. I explored interactions
            between nearby vehicles with GATv2 in PyTorch Geometric, then moved
            to reinforcement learning to model the consequences of lane changes.
          </p>
          <p>
            NVIDIA Jetson runs inference with a CUDA / TensorRT deployment
            pipeline. A Raspberry Pi handles camera input and the physical
            prototype’s controls.
          </p>
          <p className="project-recognition">Jugend forscht, 2nd Prize</p>
          <div className="simulation-results">
            <p>Simulation evaluation</p>
            <p className="simulation-description">
              Lane-change decisions are evaluated in a traffic simulation using
              average speed, hard-braking events, and collisions.
            </p>
            <span>Simulation evaluation, not public-road measurements.</span>
          </div>
          <a
            className="text-link"
            href="https://github.com/AppSolves/LanePilot"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the system{" "}
            <ArrowUpRight
              data-arrow-motion="external"
              size={17}
              aria-hidden="true"
            />
          </a>
        </div>
        <figure className="lane-figure">
          <div className="lane-stage">
            <div className="lane-stage-heading">
              <span>LanePilot</span>
              <span>Prototype perception</span>
            </div>
            <div className="lane-crop">
              <picture>
                {["avif", "webp"].map((format) => (
                  <source
                    key={format}
                    type={`image/${format}`}
                    srcSet={[640, 960, 1288]
                      .map(
                        (width) =>
                          `${base}images/lanepilot-${width}.${format} ${width}w`,
                      )
                      .join(", ")}
                    sizes="(min-width: 1800px) 740px, (min-width: 900px) 48vw, (min-width: 768px) 85vw, 90vw"
                  />
                ))}
                <img
                  src={`${base}images/lanepilot-960.webp`}
                  alt="LanePilot detecting and tracking three small vehicles in a physical test setup"
                  width="1288"
                  height="720"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <div className="lane-stage-footer">
              <span>Vehicle detection and tracking</span>
              <span>Computer vision / Edge hardware</span>
            </div>
          </div>
          <figcaption>
            Vehicle detection in LanePilot’s physical test setup.
          </figcaption>
        </figure>
      </article>

      <article
        id="tagvault"
        className="project split-project tag-project"
        aria-labelledby="tagvault-title"
      >
        <figure className="tag-figure">
          <div className="tag-stage">
            <span className="tag-stage-label">TagVault / Android</span>
            <TagVaultScene />
          </div>
          <figcaption>The TagVault interface on Android.</figcaption>
        </figure>
        <div className="split-copy">
          <p className="project-category">03 / Product engineering</p>
          <h3 id="tagvault-title">TagVault</h3>
          <p className="project-lead">Scan, manage, and automate NFC tags.</p>
          <p>
            TagVault is an Android app I built and shipped in Flutter for people
            who use NFC tags in their own workflows. It reads and writes
            compatible tags and keeps saved data in encrypted local storage,
            with biometric protection for sensitive actions.
          </p>
          <p>
            Tag scans can trigger automations and webhooks. Home-screen widgets
            provide quick access, and encrypted backups help move data between
            devices. A paid Pro tier adds further tools and backup options.
          </p>
          <p className="project-tech">Flutter / Android / NFC / Local-first</p>
          <div className="project-links">
            <a
              className="text-link"
              href="https://tagvault.appsolves.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              TagVault website{" "}
              <ArrowUpRight
                data-arrow-motion="external"
                size={17}
                aria-hidden="true"
              />
            </a>
            <a
              className="text-link secondary-link"
              href="https://play.google.com/store/apps/details?id=dev.appsolves.tag_vault"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Play{" "}
              <ArrowUpRight
                data-arrow-motion="external"
                size={17}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
