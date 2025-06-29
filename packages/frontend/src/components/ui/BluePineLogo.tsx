import React from 'react';
import logo from '@/assets/logo.png';

interface BluePineLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const BluePineLogo: React.FC<BluePineLogoProps> = ({ size = "md", className = "" }) => {
  let dimension = "h-8 w-8";
  if (size === "lg") dimension = "h-12 w-12";
  if (size === "xl") dimension = "h-16 w-16";
  return (
    <img
      src={logo}
      alt="Blue Pine AI Logo"
      className={`${dimension} ${className}`}
    />
  );
};

export default BluePineLogo; 