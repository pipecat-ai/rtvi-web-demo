import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

import { cn } from "@/utils/tailwind";

const alertVariants = cva("text-left border border-black rounded-lg p-4", {
  variants: {
    intent: {
      info: "alert-info",
      danger: "border-red-200 text-red-600 bg-red-50",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof alertVariants> {}

export const Alert: React.FC<AlertProps> = ({ children, intent, title }) => {
  return (
    <div className={alertVariants({ intent })}>
      <AlertTitle>
        {intent === "danger" && <CircleAlert size={18} />}
        {title}
      </AlertTitle>
      {children}
    </div>
  );
};

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-base font-bold flex items-center gap-2 mb-2",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";
