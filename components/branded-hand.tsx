import { Hand } from "lucide-react";

interface BrandedHandProps {
  className?: string;
  size?: number;
}

export function BrandedHand({ className = "", size = 40 }: BrandedHandProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Radiant Multi-color Aura (Subtle depth) */}
      <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-primary/10 to-emerald-500/10 blur-2xl rounded-full animate-gradient scale-150" />
      
      <div className="relative z-10 flex items-center justify-center">
        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="hand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6">
                <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#8b5cf6">
                <animate attributeName="offset" values="0.5;1.5;0.5" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#10b981">
                <animate attributeName="offset" values="1;2;1" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
        </svg>

        <Hand 
          className="rotate-[15deg] animate-bounce [animation-duration:3s]" 
          style={{ 
            stroke: "url(#hand-gradient)", 
            strokeWidth: "2.5px",
            width: `${size}px`,
            height: `${size}px`
          }}
        />
      </div>
    </div>
  );
}
