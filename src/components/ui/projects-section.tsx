import TagVaultScene from "@/components/tagvault/TagVaultScene";
import { ArrowUpRight } from "lucide-react";

const base = import.meta.env.BASE_URL;

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="selected-work page-width"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <p className="section-label">Selected work</p>
        <h2 id="work-title">
          Three projects.
          <br />
          <span>Different layers of the stack.</span>
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
            <span className="fidan-wordmark">Fidan</span>
            <p>
              Readable source.
              <br />
              Native execution.
            </p>
          </div>
          <div className="fidan-specimen">
            <span className="specimen-label">
              A small piece of the language
            </span>
            <pre tabIndex={0} aria-label="Fidan language example">
              <code>
                <span className="syntax-keyword">action</span>
                {" greet with (\n  "}
                <span className="syntax-keyword">certain</span>
                {" name "}
                <span className="syntax-keyword">oftype</span>
                {" string\n) "}
                <span className="syntax-keyword">returns</span>
                {" string {\n  "}
                <span className="syntax-keyword">return</span>{" "}
                <span className="syntax-string">{'"Hello, {name}!"'}</span>
                {"\n}\n\n"}
                <span className="syntax-function">print</span>
                {"(greet("}
                <span className="syntax-string">{'"Fidan"'}</span>
                {"))"}
              </code>
            </pre>
            <span className="specimen-caption">
              Static types. Native backends.
            </span>
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
                Explore Fidan <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a
                className="text-link secondary-link"
                href="https://github.com/fidan-lang/fidan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="project-description">
            <p className="project-lead">
              A language is only as useful as the system around it.
              <br />
              I’m building both.
            </p>
            <p>
              A general-purpose language and compiler toolchain written in Rust.
              Typed HIR and MIR, static checking and an interpreter. Cranelift
              provides JIT execution and AOT compilation to native binaries,
              with an optional LLVM AOT backend. An LSP, package tooling and
              concurrency primitives complete the workflow.
            </p>
            <p>
              Its AI tooling works with compiler-derived types and diagnostics,
              grounding assistance in what the program actually means.
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
            Traffic intelligence
            <br />
            on edge hardware.
          </p>
          <p>
            Traffic perception and dynamic lane allocation, connecting computer
            vision with graph-based optimization and edge hardware.
          </p>
          <p>
            YOLO11n-seg and PyTorch for perception. GATv2 with PyTorch Geometric
            for traffic intelligence. TensorRT / CUDA, NVIDIA Jetson and
            Raspberry Pi for deployment.
          </p>
          <p className="project-recognition">Jugend forscht, 2nd Prize</p>
          <div className="simulation-results">
            <p>Simulation results</p>
            <dl>
              <div>
                <dt>Hard-braking events</dt>
                <dd>≈ −39%</dd>
              </div>
              <div>
                <dt>Average traffic speed</dt>
                <dd>≈ +29%</dd>
              </div>
            </dl>
            <span>Measured in simulation, not on public roads.</span>
          </div>
          <a
            className="text-link"
            href="https://github.com/AppSolves/LanePilot"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the system <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <figure className="lane-figure">
          <div className="lane-stage">
            <div className="lane-stage-heading">
              <span>LanePilot</span>
              <span>Perception in practice</span>
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
              <span>Detection and tracking.</span>
              <span>Computer vision / Edge hardware</span>
            </div>
          </div>
          <figcaption>
            Vehicle detection in the prototype test environment. Actual project
            output.
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
          <figcaption>
            TagVault on Android. Encrypted storage for NFC workflows.
          </figcaption>
        </figure>
        <div className="split-copy">
          <p className="project-category">03 / Product engineering</p>
          <h3 id="tagvault-title">TagVault</h3>
          <p className="project-lead">
            NFC tools for
            <br />
            everyday use.
          </p>
          <p>
            An Android product for reading, writing and organizing NFC tags.
            Built end to end in Flutter, with encrypted local storage and
            biometric protection.
          </p>
          <p>
            Automations, webhooks, widgets and backups make it useful beyond the
            first scan. Available on Android with a paid Pro tier.
          </p>
          <p className="project-tech">Flutter / Android / NFC / Local-first</p>
          <a
            className="text-link"
            href="https://tagvault.appsolves.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meet TagVault <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </article>
    </section>
  );
}
