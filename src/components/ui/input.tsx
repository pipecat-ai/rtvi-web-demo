import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

const inputVariants = cva(
  "flex h-12 px-3 w-full rounded-xl border border-primary-200 bg-background text-sm ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        danger:
          "border-red-500 text-red-500 focus-visible:ring-red-500 placeholder:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input: React.FC<InputProps> = ({
  variant,
  className,
  type,
  ...props
}) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
};
Input.displayName = "Input";
