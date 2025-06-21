import { Footer as FooterUI } from "@/components/ui/footer"
import { useNavigate } from "react-router-dom"
import BluePineLogo from "@/components/ui/BluePineLogo";

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <FooterUI
      logo={<BluePineLogo size="lg" />}
      brandName="Blue Pine AI"
      socialLinks={[]}
      mainLinks={[]}
      legalLinks={[
        { 
          href: "/privacy-policy", 
          label: "Privacy Policy" 
        },
        { 
          href: "mailto:contact@bluepineai.com", 
          label: "contact@bluepineai.com" 
        }
      ]}
      copyright={{
        text: `© ${new Date().getFullYear()} Blue Pine AI`,
        license: "All rights reserved"
      }}
      className="text-right sm:text-left"
    />
  )
}

export default Footer
