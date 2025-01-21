import * as Accordion from "@radix-ui/react-accordion";
import { ComponentProps } from "react";
import AccordionHeader from "./AccordionHeader";

type IAccordionTrigger = ComponentProps<typeof Accordion.Trigger>;

const AccordionTrigger = ({ children, ...props }: IAccordionTrigger) => {
  return (
    <AccordionHeader>
      <Accordion.Trigger {...props}>{children}</Accordion.Trigger>
    </AccordionHeader>
  );
};

export default AccordionTrigger;
