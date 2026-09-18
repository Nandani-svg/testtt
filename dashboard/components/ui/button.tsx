import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
    const variants = {
      primary: "bg-primary text-slate-950 hover:bg-primary-hover shadow-sm shadow-primary/20",
      secondary: "bg-surface border border-card-border text-foreground hover:bg-surface-hover",
      danger: "bg-danger text-white hover:bg-danger-hover",
      ghost: "text-slate-400 hover:bg-surface-hover hover:text-foreground",
      outline: "border border-card-border bg-transparent text-slate-300 hover:bg-surface-hover hover:text-foreground",
    };
    const sizes = {
      sm: "h-7 gap-1.5 px-2.5 text-xs",
      md: "h-9 gap-2 px-3.5 text-sm",
      lg: "h-10 gap-2 px-5 text-sm",
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = "Button";
