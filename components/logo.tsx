import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const dimensions = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={cn("flex items-center gap-3 group transition-all duration-300", className)}>
      <div className={cn("relative flex items-center justify-center", dimensions[size])}>
        {/* Premium SVG Logo */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Abstract Speech Bubble / Brain Shape */}
          <path
            d="M50 20C30 20 15 32 15 48C15 56 20 64 28 70L25 85L45 78C47 78 49 78 50 78C70 78 85 66 85 50C85 34 70 20 50 20Z"
            fill="url(#logo-grad)"
            className="opacity-20"
          />
          <path
            d="M50 25C35 25 22 35 22 48C22 55 26 61 32 65L30 75L45 70C47 71 49 71 50 71C65 71 78 61 78 48C78 35 65 25 50 25Z"
            stroke="url(#logo-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          {/* AI / Connectivity Dots */}
          <circle cx="40" cy="48" r="4" fill="#3b82f6" />
          <circle cx="50" cy="48" r="4" fill="#10b981" />
          <circle cx="60" cy="48" r="4" fill="#3b82f6" />
          <path d="M40 48H60" stroke="white" strokeWidth="1" strokeDasharray="2 2" className="opacity-50" />
        </svg>
      </div>
      <span className={cn("font-bold tracking-tighter select-none", size === "lg" ? "text-2xl" : "text-lg")}>
        <span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">Word</span>
        <span className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Trainer</span>
      </span>
    </div>
  );
}
