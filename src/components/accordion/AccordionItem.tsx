import * as Accordion from "@radix-ui/react-accordion";
import { ComponentProps } from "react";

type IAccordionItem = ComponentProps<typeof Accordion.Item>;

const AccordionItem = ({ children, ...props }: IAccordionItem) => {
  return <Accordion.Item {...props}>{children}</Accordion.Item>;
};

export default AccordionItem;
