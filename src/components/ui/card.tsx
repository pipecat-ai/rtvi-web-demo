import * as React from "react";

import { cn } from "@/utils/tailwind";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
  fullWidthMobile?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow, fullWidthMobile = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-transparent bg-origin-border borderClip bg-cardBorder",
        shadow && "shadow-long",
        fullWidthMobile && "w-full max-w-full min-w-full md:min-w-0",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3 p-6 lg:p-9", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-pretty",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-lg text-pretty text-primary-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  stack?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, stack = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-6 pt-0 lg:p-9 lg:pt-0",
        stack && "flex flex-col gap-3 lg:gap-4",
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-center items-center p-6 pt-0 lg:p-9 lg:pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
