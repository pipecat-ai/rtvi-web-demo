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
        <CircleHelp size={16} className={cn("text-primary-400", className)} />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
};

export default HelpTip;
