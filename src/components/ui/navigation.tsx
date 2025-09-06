import { useState } from "react";
import { Button } from "./button";
import { Menu, X } from "lucide-react";

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
                src="wordmark2.png" 
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
          <div className="hidden md:flex items-center space-x-3.5">
            <iframe
              src="https://github.com/sponsors/AppSolves/button"
              title="Sponsor AppSolves"
              height="32"
              width="114"
              style={{ border: 0, borderRadius: 6 }}
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                window.open("mailto:contact@appsolves.dev", "_blank");
              }}
            >
              Get in touch
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-nav-text hover:text-nav-text-hover transition-colors text-base font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <Button variant="default" size="sm" className="w-full" onClick={() => {
                  window.open("mailto:contact@appsolves.dev", "_blank");
                }}>
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;