import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

const selectVariants = cva(
  "appearance-none bg-none bg-white bg-selectArrow bg-no-repeat bg-selectArrow flex h-12 px-3 pr-10 w-full rounded-xl border border-primary-200 text-sm ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  icon: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  variant,
  className,
  children,
  icon,
  ...props
}) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary-500">
          {icon}
        </div>
      )}
      <select
        className={cn(
          selectVariants({ variant }),
          icon ? "pl-11" : "",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
Select.displayName = "Input";
