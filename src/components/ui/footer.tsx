import { Github, Linkedin, Mail, Youtube, Instagram, Twitter, Play } from "lucide-react";
import { Button } from "./button";

const Footer = () => {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/AppSolves",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/AppSolves",
    },
    {
      name: "Twitter/X",
      icon: Twitter,
      url: "https://x.com/AppSolves",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/appsolves.dev",
    },
    {
      name: "Google Play",
      icon: Play,
      url: "https://play.google.com/store/apps/dev?id=6007461154397933888",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@curioburstz",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:contact@appsolves.dev",
    },
  ];

  return (
    <footer id="footer-section" className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <p className="flex justify-center items-center gap-4">
              <a href="/privacy_policy">Privacy Policy</a>
              <span>|</span>
              <a href="/terms_and_conditions">Terms & Conditions</a>
            </p>
            <br></br>
            <p>© {new Date().getFullYear()} Kaan Gönüldinc (aka AppSolves). All rights reserved.</p>
            <br></br>
            <p>You may find more information on the <a href="https://legacy.appsolves.dev" target="_blank">legacy version</a> of this site.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;