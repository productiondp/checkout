import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  className, 
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-semibold text-text ml-1">
          {label}
        </label>
      )}
      <input
        className={cn("input-minimal", className)}
        {...props}
      />
    </div>
  );
};

export default Input;
