import {
  ArrowUp,
  ArrowLeft,
  ArrowUpRight,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Coffee,
  Heart,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const socials = [
  { label: "GitHub", href: "https://github.com/AppSolves", icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/kaangoenueldinc",
    icon: Linkedin,
  },
  { label: "X", href: "https://x.com/AppSolves", icon: null },
  {
    label: "Instagram",
    href: "https://instagram.com/appsolves.dev",
    icon: Instagram,
  },
  {
    label: "Google Play",
    href: "https://play.google.com/store/apps/dev?id=6007461154397933888",
    icon: null,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@appsolvesdev",
    icon: Youtube,
  },
];

export default function Footer() {
  const { pathname } = useLocation();
  const home = import.meta.env.BASE_URL;
  const compact = pathname !== home;
  const BackArrow = compact ? ArrowLeft : ArrowUp;

  return (
    <footer
      id="contact"
      className={`site-footer${compact ? " footer-compact" : ""}`}
    >
      <div className="page-width">
        {!compact && (
          <div className="contact-composition">
            <div>
              <p className="section-label">Contact</p>
              <h2>
                Good problems
                <br />
                <em>welcome.</em>
              </h2>
            </div>
            <div className="contact-copy">
              <p>
                If you have a project or research question,
                <br />
                let’s talk.
              </p>
              <a className="contact-email" href="mailto:contact@appsolves.dev">
                contact@appsolves.dev{" "}
                <ArrowUpRight
                  data-arrow-motion="external"
                  size={25}
                  aria-hidden="true"
                />
              </a>
              <div className="contact-socials">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label === "Google Play" ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 40 40"
                        aria-hidden="true"
                      >
                        <use href={`${home}icons/google-play.svg#mark`} />
                      </svg>
                    ) : Icon ? (
                      <Icon size={16} strokeWidth={1.65} aria-hidden="true" />
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L1.4 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7 3.9H5.2L17.8 20Z" />
                      </svg>
                    )}
                    {label}
                  </a>
                ))}
              </div>
              <div className="contact-support">
                <a
                  href="https://github.com/sponsors/AppSolves"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart size={14} strokeWidth={1.65} aria-hidden="true" />{" "}
                  Sponsor the work
                </a>
                <a
                  href="https://www.buymeacoffee.com/AppSolves"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Coffee size={14} strokeWidth={1.65} aria-hidden="true" /> Buy
                  me a coffee
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="footer-bottom">
          <a className="footer-brand" href={home}>
            AppSolves
          </a>
          <span>© {new Date().getFullYear()} Kaan Gönüldinc</span>
          <div className="legal-links">
            <a href="/privacy_policy">Privacy policy</a>
            <a href="/terms_and_conditions">Terms & conditions</a>
          </div>
          <a className="back-top" href={compact ? home : "#main"}>
            {compact ? "Back home" : "Back to top"}{" "}
            <BackArrow
              data-arrow-motion={compact ? "left" : "up"}
              size={16}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
