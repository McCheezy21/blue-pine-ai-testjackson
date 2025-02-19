
import { Footer as FooterUI } from "@/components/ui/footer"
import { Github, Twitter } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <FooterUI
      logo={null}
      brandName="Blue Pine AI"
      socialLinks={[
        {
          icon: <Github className="h-5 w-5" />,
          href: "https://github.com/bluepineai",
          label: "GitHub"
        },
        {
          icon: <Twitter className="h-5 w-5" />,
          href: "https://twitter.com/bluepineai",
          label: "Twitter"
        }
      ]}
      mainLinks={[]}
      legalLinks={[
        {
          href: "/privacy-policy",
          label: "Privacy Policy"
        }
      ]}
      copyright={{
        text: "© 2024 Blue Pine AI LLC. All rights reserved."
      }}
    />
  )
}

export default Footer
