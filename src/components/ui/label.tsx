import * as React from "react";

import { cn } from "@/utils/tailwind";

export const Label: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <label className={cn("font-medium text-sm", className)}>{children}</label>
);

Label.displayName = "Label";
