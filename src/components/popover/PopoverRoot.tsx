import * as Popover from "@radix-ui/react-popover";
import { PopoverContext } from "./context";

interface IPopover extends Popover.PopoverProps {}

const PopoverRoot = ({ open, onOpenChange = () => {}, children }: IPopover) => {
  return (
    <PopoverContext.Provider
      value={{ isOpen: !!open, setIsOpen: onOpenChange }}
    >
      <Popover.Root open={!!open} onOpenChange={onOpenChange}>
        {children}
      </Popover.Root>
    </PopoverContext.Provider>
  );
};

export default PopoverRoot;
