"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandedSpinnerProps {
  className?: string;
  size?: number;
}

/**
 * A premium spinner that uses the brand's signature Blue-Primary-Emerald gradient.
 * Works by applying a linearGradient directly to the stroke of the Lucide Loader2 icon.
 */
export function BrandedSpinner({ className, size = 24 }: BrandedSpinnerProps) {
  return (
    <div className={cn("relative flex items-center justify-center p-0.5", className)}>
      <svg width="0" height="0" className="absolute invisible">
        <defs>
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
            <stop offset="50%" stopColor="#8b5cf6" /> {/* primary violet */}
            <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
          </linearGradient>
        </defs>
      </svg>
      <Loader2 
        className="animate-spin" 
        size={size}
        style={{ stroke: "url(#brand-gradient)" }}
      />
    </div>
  );
}

/**
 * Centered, full-page or section version of the BrandedSpinner.
 */
export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-24 w-full", className)}>
      <BrandedSpinner size={32} />
    </div>
  );
}
