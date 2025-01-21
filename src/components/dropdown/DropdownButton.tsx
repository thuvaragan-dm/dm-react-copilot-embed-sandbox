import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../utilities/cn";

interface IDropdownButton
  extends RadixDropdownMenu.DropdownMenuSubTriggerProps {}

const DropdownButton = ({ children, className }: IDropdownButton) => {
  return (
    <RadixDropdownMenu.Trigger
      className={cn(
        "cursor-default select-none rounded px-4 text-2xl focus-visible:outline-none",
        className
      )}
    >
      {children}
    </RadixDropdownMenu.Trigger>
  );
};

export default DropdownButton;
