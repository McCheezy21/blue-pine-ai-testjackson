
export const updateFavicon = (imageUrl: string) => {
  // Create an image element to load the source image
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;
  
  img.onload = () => {
    // Create canvas with desired favicon dimensions
    const canvas = document.createElement('canvas');
    const size = 32; // Standard favicon size
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Determine the crop area to focus on the tree
    // For this specific image, we'll crop a bit from all sides to zoom in on the tree
    const cropFactor = 0.4; // Adjust this value to control zoom level
    const cropWidth = img.width * cropFactor;
    const cropHeight = img.height * cropFactor;
    const cropX = (img.width - cropWidth) / 2;
    const cropY = (img.height - cropHeight) / 2;
    
    // Draw the cropped image to the canvas
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight, // Source rectangle
      0, 0, size, size                     // Destination rectangle
    );
    
    // Convert canvas to data URL
    const faviconUrl = canvas.toDataURL('image/png');
    
    // Update or create favicon link element
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    // Set the new favicon
    link.href = faviconUrl;
  };
};
