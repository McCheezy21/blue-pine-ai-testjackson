import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  to?: string; // Added to support navigation
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      to,
      ...props
    },
    ref,
  ) => {
    const buttonContent = (
      <>
        {/* spark container - moved outside the content for border effect */}
        <div
          className={cn(
            "absolute inset-0 -z-30 blur-[2px]",
            "overflow-visible [container-type:size]",
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>

        {/* Solid background container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {children}
        </div>

        {/* Highlight - modified to be more subtle */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff0a]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff1f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff1f]",
          )}
        />

        {/* Solid backdrop */}
        <div
          className={cn(
            "absolute inset-[2px] -z-20 [background:var(--bg)] [border-radius:calc(var(--radius)-2px)]",
          )}
        />
      </>
    );

    const commonStyles = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
    } as CSSProperties;

    const commonClassNames = cn(
      "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
      "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
      className,
    );

    // If a "to" prop is provided, render as a Link
    if (to) {
      return (
        <Link 
          to={to}
          style={commonStyles}
          className={commonClassNames}
        >
          {buttonContent}
        </Link>
      );
    }

    // Otherwise render as a button
    return (
      <button
        style={commonStyles}
        className={commonClassNames}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
