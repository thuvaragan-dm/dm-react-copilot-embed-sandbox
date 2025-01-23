import * as RadixPopover from "@radix-ui/react-popover";
import PopoverRoot from "./PopoverRoot";
import PopoverButton from "./PopoverButton";
import PopoverContent from "./PopoverContent";

interface PopoverProps extends RadixPopover.PopoverProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the Popover interface
interface IPopover extends React.FC<PopoverProps> {
  Button: typeof PopoverButton;
  Content: typeof PopoverContent;
}

// Enhance PopoverRoot with additional components
const Popover: IPopover = Object.assign(PopoverRoot, {
  Button: PopoverButton,
  Content: PopoverContent,
}) as IPopover;

export default Popover;
