
import { Footer as UIFooter } from "@/components/ui/footer"

const Footer = () => {
  return (
    <UIFooter
      logo={
        <img 
          src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
          alt="Blue Pine AI Logo" 
          className="h-14 w-14 brightness-0 invert"
        />
      }
      brandName="Blue Pine AI"
      socialLinks={[]}
      mainLinks={[]}
      legalLinks={[
        { href: "mailto:contact@bluepineai.com", label: "contact@bluepineai.com" },
        { href: "/privacy-policy", label: "Privacy Policy" },
      ]}
      copyright={{
        text: `© ${new Date().getFullYear()} Blue Pine AI`,
        license: "All rights reserved",
      }}
    />
  );
};

export default Footer;
