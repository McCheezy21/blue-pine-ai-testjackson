import { Hexagon, Github, Twitter } from "lucide-react"
import { Footer as UIFooter } from "@/components/ui/footer"

const Footer = () => {
  return (
    <UIFooter
      logo={
        <img 
          src="/lovable-uploads/da7c17c5-429b-4214-9103-3a18d0b27744.png" 
          alt="Blue Pine AI Logo" 
          className="h-12 w-12 brightness-0 invert"  // This makes the dark logo white
        />
      }
      brandName="Blue Pine AI"
      socialLinks={[
        {
          icon: <Twitter className="h-5 w-5" />,
          href: "https://twitter.com/bluepineai",
          label: "Twitter",
        },
        {
          icon: <Github className="h-5 w-5" />,
          href: "https://github.com/bluepineai",
          label: "GitHub",
        },
      ]}
      mainLinks={[
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ]}
      legalLinks={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ]}
      copyright={{
        text: `© ${new Date().getFullYear()} Blue Pine AI`,
        license: "All rights reserved",
      }}
    />
  );
};

export default Footer;