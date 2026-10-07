import { ArrowDown, ArrowUpRight } from "lucide-react";
import BrandScene from "@/components/brand/BrandScene";

export default function HeroSection() {
  return (
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="hero-intro">
            Kaan Gönüldinc <span>Independent builder</span>
          </p>
          <h1 id="hero-title">
            <span className="headline-mask">
              <span className="hero-line">Deep thinking.</span>
            </span>
            <span className="headline-mask">
              <em className="hero-line">Real things.</em>
            </span>
          </h1>
          <p className="hero-description">
            I build AI systems, compilers, and software products.
            <br className="desktop-break" /> From the underlying architecture to
            the thing you can actually use.
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
        <span className="hero-index-label">
          Ideas into
          <br />
          working systems.
        </span>
        <a href="#fidan">
          <span>Fidan</span>
          <span>Language & compiler</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <a href="#lanepilot">
          <span>LanePilot</span>
          <span>Deep learning & edge AI</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <a href="#tagvault">
          <span>TagVault</span>
          <span>Shipped Android product</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </nav>
    </section>
  );
}
