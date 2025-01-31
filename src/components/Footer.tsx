import { Footer as UIFooter } from "@/components/ui/footer"

const Footer = () => {
  return (
    <UIFooter
      logo={null}
      brandName="Blue Pine AI"
      socialLinks={[]}
      mainLinks={[]}
      legalLinks={[
        { href: "mailto:contact@bluepineai.com", label: "contact@bluepineai.com" },
      ]}
      copyright={{
        text: `© ${new Date().getFullYear()} Blue Pine AI`,
        license: "All rights reserved",
      }}
    />
  );
};

export default Footer;