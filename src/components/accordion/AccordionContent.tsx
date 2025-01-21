import * as Accordion from "@radix-ui/react-accordion";
import { ComponentProps } from "react";
import { cn } from "../../utilities/cn";

type IAccordionContent = ComponentProps<typeof Accordion.Content>;

const AccordionContent = ({
  children,
  className,
  ...props
}: IAccordionContent) => {
  return (
    <Accordion.Content
      className={cn(
        "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      {children}
    </Accordion.Content>
  );
};

export default AccordionContent;
