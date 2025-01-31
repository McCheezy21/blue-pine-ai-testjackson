import { Footer as UIFooter } from "@/components/ui/footer"
import { useEffect, useState } from "react"
import { removeBackground, loadImage } from "@/utils/imageUtils"

const Footer = () => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png");

  useEffect(() => {
    const processImage = async () => {
      try {
        // Fetch the original image
        const response = await fetch("/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png");
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
        <div className="flex items-center gap-2">
          <img 
            src={processedImageUrl}
            alt="Blue Pine AI Logo" 
            className="h-8 w-8 brightness-0 invert"
          />
          <span className="font-bold text-lg text-primary-foreground">Blue Pine AI</span>
        </div>
      }
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