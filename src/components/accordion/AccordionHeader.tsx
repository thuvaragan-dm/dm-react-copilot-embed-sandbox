import * as Accordion from "@radix-ui/react-accordion";
import { ComponentProps } from "react";

type IAccordionHeader = ComponentProps<typeof Accordion.Header>;

const AccordionHeader = ({ children, ...props }: IAccordionHeader) => {
  return <Accordion.Header {...props}>{children}</Accordion.Header>;
};

export default AccordionHeader;
