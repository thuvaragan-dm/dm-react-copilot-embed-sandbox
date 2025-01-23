import * as Popover from "@radix-ui/react-popover";
import { cn } from "../../utilities/cn";

interface IPopoverButton extends Popover.PopoverTriggerProps {}

const PopoverButton = ({ children, className }: IPopoverButton) => {
  return (
    <Popover.Trigger
      className={cn(
        "cursor-default select-none rounded px-4 text-2xl focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </Popover.Trigger>
  );
};

export default PopoverButton;
