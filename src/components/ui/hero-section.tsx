import BrandScene from "@/components/brand/BrandScene";
import { ArrowDown } from "lucide-react";

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
              <span className="hero-line">I build software</span>
            </span>{" "}
            <span className="headline-mask">
              <em className="hero-line">from the inside out.</em>
            </span>
          </h1>
          <p className="hero-description">
            I develop AI systems for edge hardware and ship software products,
            including Fidan, my own programming language and compiler. My goal
            is to turn that work into an AI company.
          </p>
          <div className="hero-actions">
            <a className="text-link" href="#work">
              Explore the work{" "}
              <ArrowDown
                data-arrow-motion="down"
                size={18}
                aria-hidden="true"
              />
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
          <ArrowDown data-arrow-motion="down" size={17} aria-hidden="true" />
        </a>
        <a href="#lanepilot">
          <span>LanePilot</span>
          <span>Deep learning & edge AI</span>
          <ArrowDown data-arrow-motion="down" size={17} aria-hidden="true" />
        </a>
        <a href="#tagvault">
          <span>TagVault</span>
          <span>Shipped Android product</span>
          <ArrowDown data-arrow-motion="down" size={17} aria-hidden="true" />
        </a>
      </nav>
    </section>
  );
}
