import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "GitHub", href: "https://github.com/AppSolves" },
  { label: "LinkedIn", href: "https://linkedin.com/in/kaangoenueldinc" },
  { label: "Instagram", href: "https://instagram.com/appsolves.dev" },
  { label: "YouTube", href: "https://youtube.com/@appsolvesdev" },
];

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-white/[0.08]">
      <div className="mx-auto max-w-[1480px] px-5 pb-10 pt-24 sm:px-8 sm:pt-32 lg:px-10">
        <div className="section-kicker">Contact</div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <h2 className="max-w-4xl text-[clamp(3rem,6vw,7rem)] font-medium leading-[0.93] tracking-[-0.065em] text-foreground">
            Building something ambitious?
          </h2>

          <a
            href="mailto:contact@appsolves.dev"
            className="group inline-flex max-w-full items-center gap-3 text-[clamp(1.6rem,3vw,3.4rem)] font-medium tracking-[-0.04em] text-foreground lg:justify-end"
          >
            <span className="break-all">contact@appsolves.dev</span>
            <ArrowUpRight className="h-[0.7em] w-[0.7em] shrink-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-24 grid gap-8 border-t border-white/[0.08] pt-7 text-sm sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
          <div className="text-muted-foreground">
            © {new Date().getFullYear()} Kaan Gönüldinc / AppSolves
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            <a href="/privacy_policy" className="text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="/terms_and_conditions" className="text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </a>
            <a
              href="https://github.com/sponsors/AppSolves"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sponsor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
