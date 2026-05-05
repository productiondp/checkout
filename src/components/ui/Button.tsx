import React from "react";

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
    secondary: "bg-gray-100 text-black hover:bg-black/[0.04] rounded-lg px-6 py-4 font-black ",
    outline: "border-2 border-gray-100 text-black hover:bg-gray-50 rounded-lg px-6 py-4 font-black ",
    ghost: "text-gray-500 hover:text-red-600 transition-colors font-black ",
  };

  // Inlined cn logic to resolve persistent Webpack 'is not a function' errors
  const combinedClasses = [
    "inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 active:scale-[0.98]",
    variants[variant],
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
