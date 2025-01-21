// Import the components
import AccordionContent from "./AccordionContent";
import AccordionItem from "./AccordionItem";
import AccordionRoot from "./AccordionRoot";
import {
  AccordionSingleProps,
  AccordionMultipleProps,
} from "@radix-ui/react-accordion";
import AccordionTrigger from "./AccordionTrigger";

// Define the type for the enhanced Accordion
interface IAccordion
  extends React.FC<AccordionSingleProps | AccordionMultipleProps> {
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
  Item: typeof AccordionItem;
}

// Enhance AccordionRoot with additional components
const Accordion: IAccordion = Object.assign(AccordionRoot, {
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Item: AccordionItem,
}) as IAccordion;

// Export the enhanced Accordion as the default export
export default Accordion;
