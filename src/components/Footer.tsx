
import { Footer as FooterUI } from "@/components/ui/footer"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <FooterUI
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
