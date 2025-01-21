// Import the components
import TooltipContent from "./TooltipContent";
import TooltipRoot from "./TooltipRoot"; // Assuming TooltipProps is exported from TooltipRoot
import TooltipTrigger from "./TooltipTrigger";
import { TooltipProps } from "@radix-ui/react-tooltip";

// Define the interface for the enhanced Tooltip
interface ITooltip extends React.FC<TooltipProps> {
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
}

// Enhance TooltipRoot with additional components
const Tooltip: ITooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
}) as ITooltip;

// Export the enhanced Tooltip as the default export
export default Tooltip;
