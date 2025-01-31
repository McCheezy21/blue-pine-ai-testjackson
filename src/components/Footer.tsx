import { Hexagon, Github, Twitter } from "lucide-react"
import { Footer as UIFooter } from "@/components/ui/footer"

const Footer = () => {
  return (
    <UIFooter
      logo={<Hexagon className="h-10 w-10 text-primary-foreground" />}
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