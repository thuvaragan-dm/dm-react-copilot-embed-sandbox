import * as Accordion from "@radix-ui/react-accordion";
import { ComponentProps } from "react";

type IAccordionRoot = ComponentProps<typeof Accordion.Root>;

const AccordionRoot = ({ children, ...props }: IAccordionRoot) => {
  return <Accordion.Root {...props}>{children}</Accordion.Root>;
};

export default AccordionRoot;
