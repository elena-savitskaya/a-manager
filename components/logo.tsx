import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <span className={cn("font-black tracking-tighter select-none", sizeClasses[size], className)}>
      <span className="text-primary">AI</span>
      <span className="text-blue-500">Word</span>
      <span className="text-emerald-500">Lab</span>
    </span>
  );
}
