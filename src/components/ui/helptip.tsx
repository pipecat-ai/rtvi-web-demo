import React from "react";
import { CircleHelp } from "lucide-react";

import { cn } from "@/utils/tailwind";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface HelpTipProps {
  text: string;
  className?: string;
}

const HelpTip: React.FC<HelpTipProps> = ({ text, className }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleHelp
          size={16}
          className={cn("text-primary-400 hidden md:block", className)}
        />
      </TooltipTrigger>
      <TooltipContent asChild>
        <span className="text-sm font-medium">{text}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default HelpTip;
