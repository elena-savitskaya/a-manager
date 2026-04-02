"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface GradientInputProps extends React.ComponentProps<typeof Input> {
  wrapperClassName?: string;
  glowColor?: "primary" | "emerald" | "blue" | "mixed";
}

const GradientInput = React.forwardRef<HTMLInputElement, GradientInputProps>(
  ({ className, wrapperClassName, glowColor = "mixed", ...props }, ref) => {
    const gradientMap = {
      mixed: "from-blue-500 via-primary to-emerald-500",
      primary: "from-primary/50 via-primary to-primary/50",
      emerald: "from-emerald-500/50 via-emerald-500 to-emerald-500/50",
      blue: "from-blue-500/50 via-blue-500 to-blue-500/50",
    };

    return (
      <div 
        className={cn(
          "p-[1.5px] rounded-2xl transition-all duration-300 shadow-sm",
          "ring-1 ring-foreground/10 bg-transparent",
          "focus-within:ring-0 focus-within:bg-gradient-to-r focus-within:shadow-md focus-within:shadow-primary/20",
          gradientMap[glowColor],
          wrapperClassName
        )}
      >
        <div className="bg-background rounded-[14.5px] overflow-hidden">
          <Input
            className={cn(
              "border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-5",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
GradientInput.displayName = "GradientInput";

export { GradientInput };
