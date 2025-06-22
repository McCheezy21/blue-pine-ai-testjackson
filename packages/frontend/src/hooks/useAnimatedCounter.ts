
import { useState, useEffect } from 'react';

interface UseAnimatedCounterProps {
  targetValue: number;
  duration?: number;
  startAnimation?: boolean;
}

export const useAnimatedCounter = ({ 
  targetValue, 
  duration = 1000, 
  startAnimation = true 
}: UseAnimatedCounterProps) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCurrentValue(Math.floor(easeOutQuart * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration, startAnimation]);

  return currentValue;
};
