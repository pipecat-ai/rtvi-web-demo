import React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-xl border text-base font-semibold ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-5",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:text-primary-foreground/50",
        ghost:
          "border-primary-200 bg-white text-primary hover:border-primary-300 hover:bg-white/0 disabled:text-primary-foreground/50",
        outline: "button-outline",
        light: "button-light",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidthMobile?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  fullWidthMobile,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        fullWidthMobile ? "w-full md:w-auto" : "",
        className
      )}
      {...props}
    />
  );
};
