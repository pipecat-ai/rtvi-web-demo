import * as React from "react";

import { cn } from "@/utils/tailwind";

import { Label } from "./label";

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string | undefined | boolean;
}

export const Field: React.FC<FieldProps> = ({
  className,
  label,
  error,
  children,
}) => (
  <div className={cn("flex flex-col items-start gap-2 w-full", className)}>
    <Label className="font-medium text-sm">{label}</Label>
    {children}
    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
  </div>
);

Field.displayName = "Field";
