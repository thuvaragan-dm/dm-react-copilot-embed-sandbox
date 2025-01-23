import { createContext } from "react";

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

interface PopoverContentContextType {
  closePopover: () => Promise<void>;
}

// Create context to manage the dropdown state with default values
export const PopoverContext = createContext<PopoverContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

// Create context to manage the dropdown menu actions with default values
export const PopoverContentContext = createContext<PopoverContentContextType>({
  closePopover: async () => {},
});
