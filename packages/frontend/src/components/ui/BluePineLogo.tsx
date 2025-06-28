import React from 'react';

interface BluePineLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const BluePineLogo: React.FC<BluePineLogoProps> = ({ 
  className = '', 
  size = 'lg' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-9',
    md: 'w-10 h-11',
    lg: 'w-12 h-14',
    xl: 'w-16 h-18',
    xxl: 'w-20 h-22'
  };

  return (
    <img
      src="/blue-pine-logo.png"
      alt="Blue Pine AI Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      draggable={false}
    />
  );
};

export default BluePineLogo; 