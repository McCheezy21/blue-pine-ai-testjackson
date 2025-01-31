import { Hexagon, Github, Twitter } from "lucide-react"
import { Footer as UIFooter } from "@/components/ui/footer"
import { useEffect, useState } from "react"
import { removeBackground, loadImage } from "@/utils/imageUtils"

const Footer = () => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("/lovable-uploads/da7c17c5-429b-4214-9103-3a18d0b27744.png");

  useEffect(() => {
    const processImage = async () => {
      try {
        // Fetch the original image
        const response = await fetch("/lovable-uploads/da7c17c5-429b-4214-9103-3a18d0b27744.png");
        const blob = await response.blob();
        
        // Load the image
        const img = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(img);
        
        // Create URL for the processed image
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedImageUrl(processedUrl);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    };

    processImage();

    // Cleanup
    return () => {
      if (processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, []);

  return (
    <UIFooter
      logo={
        <img 
          src={processedImageUrl}
          alt="Blue Pine AI Logo" 
          className="h-12 w-12 brightness-0 invert"  // Makes the logo white
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