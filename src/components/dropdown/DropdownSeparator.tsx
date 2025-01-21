import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../utilities/cn";

interface IDropdownSeparator
  extends RadixDropdownMenu.DropdownMenuSeparatorProps {}
const DropdownSeparator = ({ className }: IDropdownSeparator) => {
  return (
    <RadixDropdownMenu.Separator
      className={cn("border-[0.5px] border-gray-300", className)}
    />
  );
};

export default DropdownSeparator;
