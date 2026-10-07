import { ArrowDown } from "lucide-react";
import BrandScene from "@/components/brand/BrandScene";

export default function HeroSection() {
  return (
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="hero-intro">
            Kaan Gönüldinc <span>/ AppSolves</span>
          </p>
          <h1 id="hero-title">
            <span className="headline-mask">
              <span className="hero-line">Think deeply.</span>
            </span>
            <span className="headline-mask">
              <em className="hero-line">Build real things.</em>
            </span>
          </h1>
          <p className="hero-description">
            I build AI systems, compilers, and software products.
            <br className="desktop-break" /> I work on the internals and carry
            the software through to release.
          </p>
          <div className="hero-actions">
            <a className="text-link" href="#work">
              Explore the work <ArrowDown size={18} aria-hidden="true" />
            </a>
            <span className="hero-context">Computer Science at TUM</span>
          </div>
        </div>
        <div className="hero-object">
          <BrandScene />
        </div>
      </div>
      <nav className="hero-index" aria-label="Featured projects">
        <a href="#fidan">
          <span>Fidan</span>
          <span>Language & compiler</span>
          <ArrowDown size={17} aria-hidden="true" />
        </a>
        <a href="#lanepilot">
          <span>LanePilot</span>
          <span>Deep learning & edge AI</span>
          <ArrowDown size={17} aria-hidden="true" />
        </a>
        <a href="#tagvault">
          <span>TagVault</span>
          <span>Shipped Android product</span>
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </nav>
    </section>
  );
}
