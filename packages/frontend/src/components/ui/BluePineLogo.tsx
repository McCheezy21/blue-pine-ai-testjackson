import React from 'react';
import logo from '@/assets/logo.png';

interface BluePineLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'default' | 'footer';
}

const BluePineLogo: React.FC<BluePineLogoProps> = ({ 
  className = '', 
  size = 'lg',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    xxl: 'w-32 h-32'
  };

  const src = variant === 'footer' ? '/blue-pine-logo-footer.png' : '/blue-pine-logo.png';
  
  return (
    <img
      src={src}
      alt="Blue Pine AI Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      draggable={false}
    />
  );
};

export default BluePineLogo; 