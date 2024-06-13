import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva("input", {
  variants: {
    variant: {
      default: "input-default",
      danger: "input-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

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
      className={inputVariants({ variant, className })}
      {...props}
    />
  );
};
Input.displayName = "Input";
