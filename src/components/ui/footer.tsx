import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const { pathname } = useLocation();
  const home = import.meta.env.BASE_URL;
  const compact = pathname !== home;

  return (
    <footer
      id="contact"
      className={`site-footer${compact ? " footer-compact" : ""}`}
    >
      <div className="page-width">
        {!compact && (
          <div className="contact-composition">
            <div>
              <p className="section-label">Have something in mind?</p>
              <h2>
                Good problems
                <br />
                <em>welcome.</em>
              </h2>
            </div>
            <div className="contact-copy">
              <p>
                Technical work, research, products.
                <br />
                If there’s something worth building, let’s talk.
              </p>
              <a className="contact-email" href="mailto:contact@appsolves.dev">
                contact@appsolves.dev{" "}
                <ArrowUpRight size={25} aria-hidden="true" />
              </a>
              <div className="contact-socials">
                <a
                  href="https://github.com/AppSolves"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  href="https://linkedin.com/in/kaangoenueldinc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="footer-bottom">
          <a className="footer-brand" href={home}>
            AppSolves.
          </a>
          <span>© {new Date().getFullYear()} Kaan Gönüldinc</span>
          <div className="legal-links">
            <a href="/privacy_policy">Privacy policy</a>
            <a href="/terms_and_conditions">Terms & conditions</a>
          </div>
          <a className="back-top" href={compact ? home : "#main"}>
            {compact ? "Back home" : "Back to top"}{" "}
            <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
