import { AnimatePresence, motion } from "framer-motion";
import { Sling as Hamburger } from "hamburger-react";
import { useState } from "react";
import { Button } from "./button";
import { Icons } from "./icon";

interface NavLink {
  name: string;
  href: string;
}

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: NavLink[] = [];

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md fixed top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-semibold text-foreground hover:text-nav-text-hover transition-all duration-300 hover:scale-105">
              <img
                src="/wordmark2.png"
                alt="Wordmark"
                className="non-draggable"
                draggable={false}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-nav-text hover:text-nav-text-hover transition-all duration-300 text-sm font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-2.5">
            <Button
              variant="default"
              size="sm"
              className="w-full flex items-center justify-center gap-2 group"
              onClick={() => {
                window.open("https://github.com/sponsors/AppSolves?o=esb", "_blank");
              }}
            >
              <Icons.GithubSponsors className="h-4 w-4 text-pink-500 flex-none align-middle transition-transform transform group-hover:scale-125 translate-y-[1px]" />
              <span className="leading-none">Sponsor Me</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full flex items-center justify-center group"
              onClick={() => {
                const section = document.getElementById("footer-section");
                section?.scrollIntoView({ behavior: "smooth" });
              }}>
              Get in touch
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Hamburger toggled={isMenuOpen} size={20} toggle={setIsMenuOpen} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t border-border bg-background overflow-hidden"
              initial={{ opacity: 0, height: 0, y: -30 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-2 pt-2 pb-3 space-x-2.5 items-center">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-nav-text hover:text-nav-text-hover transition-colors text-base font-medium"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-2 flex flex-col items-center space-y-2.5">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 group"
                    onClick={() => {
                      window.open("https://github.com/sponsors/AppSolves?o=esb", "_blank");
                    }}
                  >
                    <Icons.GithubSponsors className="h-4 w-4 text-pink-500 flex-none align-middle transition-transform transform group-hover:scale-125" />
                    <span className="leading-none">Sponsor Me</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full flex items-center justify-center group"
                    onClick={() => {
                      const section = document.getElementById("footer-section");
                      section?.scrollIntoView({ behavior: "smooth" });
                    }}>
                    Get in touch
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;