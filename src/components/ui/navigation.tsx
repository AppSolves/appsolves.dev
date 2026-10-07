import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#09090b]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="/"
          className="group flex items-center gap-3"
          aria-label="AppSolves home"
        >
          <img
            src="/mark.svg"
            alt=""
            className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[-4deg]"
            draggable={false}
          />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
            AppSolves
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="https://github.com/AppSolves"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="mailto:contact@appsolves.dev"
            className="group inline-flex items-center gap-2 border-b border-foreground/45 pb-1 text-sm font-medium text-foreground transition-colors hover:border-foreground"
          >
            Contact
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center text-foreground md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="border-t border-white/[0.07] bg-[#09090b] md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto flex max-w-[1480px] flex-col px-5 py-6 sm:px-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="border-b border-white/[0.07] py-4 text-lg text-foreground"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://github.com/AppSolves"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="border-b border-white/[0.07] py-4 text-lg text-foreground"
              >
                GitHub
              </a>
              <a
                href="mailto:contact@appsolves.dev"
                onClick={closeMenu}
                className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-foreground"
              >
                Contact <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
