import DropdownRoot from "./DropdownRoot"; // Assuming DropdownRoot exports its props
import DropdownButton from "./DropdownButton";
import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";

interface DropdownProps extends RadixDropdownMenu.DropdownMenuProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the Dropdown interface
interface IDropdown extends React.FC<DropdownProps> {
  Button: typeof DropdownButton;
  Menu: typeof DropdownMenu;
  Item: typeof DropdownMenuItem;
}

// Enhance DropdownRoot with additional components
const Dropdown: IDropdown = Object.assign(DropdownRoot, {
  Button: DropdownButton,
  Menu: DropdownMenu,
  Item: DropdownMenuItem,
}) as IDropdown;

export default Dropdown;
