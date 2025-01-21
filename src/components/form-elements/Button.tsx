"use client";

import { VariantProps, cva } from "class-variance-authority";
import {
  AnimationDefinition,
  motion,
  useAnimationControls,
} from "framer-motion";
import { forwardRef } from "react";
import { Button as Btn, ButtonProps, PressEvent } from "react-aria-components";
import { cn } from "../../utilities/cn";
import Spinner from "../Spinner";

// Button style variants
const variants = {
  variant: {
    primary: "btn-primary",
    secondary: "btn-secondary",
    unstyled: "btn-unstyled",
    danger: "btn-danger",
    ghost: "btn-ghost p-0 md:p-0",
  },
};

const defaultStyles =
  "touch-none select-none overflow-hidden disabled:cursor-not-allowed rounded-xl bg-skin-btn-bg px-7 py-4 text-sm font-medium text-skin-btn-text outline-none ring-skin-btn-ring ring-offset-2 ring-offset-inherit hover:bg-skin-btn-bg-hover focus:outline-none disabled:text-skin-btn-disabled disabled:bg-skin-btn-disabled data-[pressed]:bg-skin-btn-active data-[focus-visible]:ring-2 md:px-5 md:py-3";

export const ButtonVariants = cva(defaultStyles, {
  variants,
  defaultVariants: {
    variant: "primary",
  },
});

export interface IButton
  extends ButtonProps,
    VariantProps<typeof ButtonVariants> {
  children: React.ReactNode;
  onClick?: (e: PressEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  wrapperClass?: string;
  loaderClass?: string;
  disabledLoaderClass?: string;
}

// Loader component for displaying loading spinner and content
const Loader = ({
  children,
  isLoading = false,
  isDisabled = false,
  className,
  disabledClass = "text-skin-btn-disabled",
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  disabledClass?: string;
}) => {
  return (
    <motion.span
      initial={isLoading ? "loading" : "idle"}
      animate={isLoading ? "loading" : "idle"}
      variants={{
        idle: {
          transition: {
            staggerChildren: 0.2,
          },
        },
        loading: {
          transition: {
            staggerChildren: 0.2,
            staggerDirection: -1,
          },
        },
      }}
      className="relative flex items-center px-2.5"
      aria-live="polite"
      aria-busy={isLoading ? "true" : "false"}
    >
      {isLoading && (
        <motion.span
          variants={{
            loading: {
              opacity: 1,
            },
            idle: {
              opacity: 0,
            },
          }}
        >
          <Spinner
            className={cn(
              "text-btn-spinner absolute h-4 w-4",
              isDisabled && disabledClass,
              className
            )}
            style={{ marginLeft: "-11px" }}
          />
        </motion.span>
      )}
      <motion.span
        variants={{
          idle: {
            x: 0,
          },
          loading: {
            x: 11,
          },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

const ButtonWithLoader = forwardRef<HTMLButtonElement, IButton>(
  (
    {
      variant,
      disabled,
      onClick,
      className,
      children,
      isLoading = false,
      wrapperClass,
      loaderClass,
      disabledLoaderClass,
      ...props
    },
    ref
  ) => {
    const control = useAnimationControls();

    const enterAnimation: AnimationDefinition = {
      scale: 0.98,
    };

    const leaveAnimation: AnimationDefinition = {
      scale: 1,
      transition: { duration: 0.4 },
    };

    const handleClick = (e: PressEvent) => {
      if (!isLoading && onClick) {
        onClick(e); // Prevent click if loading
      }
    };

    return (
      <motion.div animate={control} className={cn("w-min", wrapperClass)}>
        <Btn
          ref={ref}
          onPressStart={() => {
            if (!isLoading) {
              control.stop();
              control.start(enterAnimation);
            }
          }}
          onPressEnd={() => {
            if (!isLoading) {
              control.start(leaveAnimation);
            }
          }}
          onPress={handleClick}
          isDisabled={disabled || isLoading}
          className={cn(ButtonVariants({ variant, className }))}
          {...props}
          aria-disabled={disabled || isLoading}
        >
          <Loader
            className={loaderClass}
            isDisabled={disabled || isLoading}
            isLoading={isLoading}
            disabledClass={disabledLoaderClass}
          >
            {children}
          </Loader>
        </Btn>
      </motion.div>
    );
  }
);

// Basic button without loader
const Button = forwardRef<HTMLButtonElement, IButton>(
  (
    {
      variant,
      disabled,
      onClick,
      className,
      children,
      isLoading = false,
      wrapperClass,
      ...props
    },
    ref
  ) => {
    const control = useAnimationControls();

    const enterAnimation: AnimationDefinition = {
      scale: 0.97,
    };

    const leaveAnimation: AnimationDefinition = {
      scale: 1,
      transition: { duration: 0.4 },
    };

    const handleClick = (e: PressEvent) => {
      if (!isLoading && onClick) {
        onClick(e); // Prevent click if loading
      }
    };

    return (
      <motion.div animate={control} className={cn("w-min", wrapperClass)}>
        <Btn
          ref={ref}
          onPressStart={() => {
            if (!isLoading) {
              control.stop();
              control.start(enterAnimation);
            }
          }}
          onPressEnd={() => {
            if (!isLoading) {
              control.start(leaveAnimation);
            }
          }}
          onPress={handleClick}
          isDisabled={disabled || isLoading}
          className={cn(ButtonVariants({ variant, className }))}
          {...props}
          aria-disabled={disabled || isLoading}
        >
          {children}
        </Btn>
      </motion.div>
    );
  }
);

ButtonWithLoader.displayName = "ButtonWithLoader";
Button.displayName = "Button";

export { Button, ButtonWithLoader };
