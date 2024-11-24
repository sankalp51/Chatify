import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

type Props = {
  mainMessage: ReactNode | string;
  info: string;
};

export default function ToolTip({ mainMessage, info }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{mainMessage}</TooltipTrigger>
        <TooltipContent className="bg-muted">
          <p className="dark:text-white text-black">{info}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
