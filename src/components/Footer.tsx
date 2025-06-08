import { Footer as FooterUI } from "@/components/ui/footer"
import { useNavigate } from "react-router-dom"
import AdminAccess from "./AdminAccess"

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative">
      {/* Admin Access - positioned discretely in footer */}
      <div className="flex justify-end px-6 py-4 bg-gray-50">
        <AdminAccess />
      </div>
      
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
    </div>
  )
}

export default Footer
