
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedImageUrl: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCrop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 200,
      height: 200,
      backgroundColor: '#ffffff'
    });
    
    setCanvas(fabricCanvas);
    
    // Load the image
    fabric.Image.fromURL(imageUrl, (img) => {
      // Scale the image to fit the canvas while maintaining aspect ratio
      const scale = Math.min(
        fabricCanvas.getWidth() / img.width!,
        fabricCanvas.getHeight() / img.height!
      );
      
      img.scale(scale * 1.5); // Scale up by 50% to crop out white space
      
      // Center the image
      img.set({
        left: fabricCanvas.getWidth() / 2,
        top: fabricCanvas.getHeight() / 2,
        originX: 'center',
        originY: 'center'
      });
      
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      
      // Generate and provide the cropped image
      setTimeout(() => {
        const dataUrl = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1
        });
        onCrop(dataUrl);
      }, 500);
    });
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [imageUrl, onCrop]);
  
  return (
    <div className="hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ImageCropper;
