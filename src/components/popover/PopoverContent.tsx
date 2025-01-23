import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useContext, useEffect } from "react";
import { cn } from "../../utilities/cn";
import { PopoverContentContext, PopoverContext } from "./context";

interface IPopoverContent extends Popover.PopoverContentProps {
  container?: Element | null | undefined;
}

const PopoverContent = ({
  children,
  className,
  container,
  ...props
}: IPopoverContent) => {
  const { isOpen, setIsOpen } = useContext(PopoverContext);
  const animationController = useAnimationControls();

  const closePopover = async () => {
    await animationController.start("close");
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      animationController.start("open");
    }
  }, [isOpen, animationController]);

  return (
    <PopoverContentContext.Provider value={{ closePopover }}>
      <AnimatePresence>
        {isOpen && (
          <Popover.Portal
            container={
              container ?? document?.getElementById("popover-container")
            }
            forceMount
          >
            <Popover.Content
              align="end"
              className={cn(
                "mt-1 w-full overflow-hidden rounded bg-white/75 p-2 text-left shadow backdrop-blur",
                className,
              )}
              asChild
              {...props}
            >
              <motion.div
                initial="close"
                animate={animationController}
                exit="close"
                variants={{
                  open: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.1 },
                  },
                  close: {
                    opacity: 0,
                    scale: 0.98,
                    y: -5,
                    transition: { duration: 0.3 },
                  },
                }}
              >
                {children}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </PopoverContentContext.Provider>
  );
};

export default PopoverContent;
