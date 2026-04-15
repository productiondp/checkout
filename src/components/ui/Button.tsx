import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = "primary", 
  ...props 
}) => {
  const variants = {
    primary: "btn-primary",
    secondary: "bg-background-soft text-text hover:bg-black/[0.04] rounded-pill px-6 py-4 font-black ",
    outline: "border-2 border-background-soft text-text hover:bg-background-soft hover:shadow-sm rounded-pill px-6 py-4 font-black ",
    ghost: "text-text-secondary hover:text-primary transition-colors font-black ",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
