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
              Human-readable.
              <br />
              Compiler-grounded.
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
              Explicit types. Native execution.
            </span>
          </div>
        </div>
        <div className="project-details">
          <div>
            <p className="project-category">AI-native programming language</p>
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
              Typed HIR and MIR, static checking, an interpreter, Cranelift
              JIT/AOT and optional LLVM AOT. An LSP, package tooling and
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
          <p className="project-category">02 / Deep learning & physical AI</p>
          <h3 id="lanepilot-title">LanePilot</h3>
          <p className="project-lead">
            Intelligence that has to work
            <br />
            outside the notebook.
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
          <p className="project-recognition">Jugend forscht · 2nd Prize</p>
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
              <img
                src={`${base}images/lanepilot-detection.png`}
                alt="LanePilot detecting and tracking three small vehicles in a physical test setup"
                width="3839"
                height="2159"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="lane-stage-footer">
              <span>From pixels to decisions.</span>
              <span>Computer vision → Edge hardware</span>
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
            <div className="tag-screens">
              <img
                className="tag-screen tag-screen-one"
                src={`${base}images/tagvault-01.jpg`}
                alt="TagVault Android app showing the NFC vault and automation entry points"
                width="1080"
                height="2214"
                loading="lazy"
                decoding="async"
              />
              <img
                className="tag-screen tag-screen-two"
                src={`${base}images/tagvault-02.jpg`}
                alt="TagVault ready to scan an NFC tag using ISO 14443-A"
                width="1080"
                height="2214"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <figcaption>
            The shipped Android app. Secure storage meets everyday NFC.
          </figcaption>
        </figure>
        <div className="split-copy">
          <p className="project-category">03 / Product engineering</p>
          <h3 id="tagvault-title">TagVault</h3>
          <p className="project-lead">
            From a hardware capability
            <br />
            to a product you can use.
          </p>
          <p>
            An Android product for reading, writing and organizing NFC / RFID
            tags. Built end to end in Flutter, with encrypted local storage and
            biometric protection.
          </p>
          <p>
            Automations, webhooks, widgets and backups make it useful beyond the
            first scan. A paid Pro tier makes it a commercial product, too.
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
