import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const links = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Open source", href: "#open-source" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const home = import.meta.env.BASE_URL;
  const onHome = pathname === home;

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => setOpen(false);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="page-width header-inner">
          <a className="brand" href={home} aria-label="AppSolves home">
            <img src={`${home}mark-mono.svg`} alt="" width="32" height="34" />
            <span>
              AppSolves<span className="brand-period">.</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <a key={link.name} href={`${onHome ? "" : home}${link.href}`}>
                {link.name}
              </a>
            ))}
            <a className="nav-contact" href={`${onHome ? "" : home}#contact`}>
              Let’s talk <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </nav>
          <button
            className="menu-toggle"
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={23} aria-hidden="true" />
            ) : (
              <Menu size={23} aria-hidden="true" />
            )}
          </button>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-nav page-width"
          aria-label="Mobile navigation"
          hidden={!open}
        >
          {[...links, { name: "Contact", href: "#contact" }].map((link) => (
            <a
              key={link.name}
              href={`${onHome ? "" : home}${link.href}`}
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
            >
              {link.name}
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </header>
    </>
  );
}
