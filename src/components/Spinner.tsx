import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { cn } from "../utilities/cn";

const variants = {
  size: {
    xs: "size-4",
    sm: "size-6",
    md: "size-14",
  },
};

const defaultStyles = "w-10 h-10 text-gray-800";

const SpinnerVariants = cva(defaultStyles, {
  variants,
});

interface ISpinner
  extends ComponentProps<"svg">,
    VariantProps<typeof SpinnerVariants> {
  wrapperClass?: string;
  "aria-label"?: string;
}

const Spinner = forwardRef<HTMLDivElement, ISpinner>(
  (
    { size, className, wrapperClass, "aria-label": ariaLabel, ...rest },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(`flex w-full items-center justify-center`, wrapperClass)}
        role="status" // ARIA role to indicate loading status
        aria-busy="true" // Indicates that the region is loading
        aria-live="polite" // Politely inform assistive technology about the loading status
      >
        <svg
          className={cn(SpinnerVariants({ size, className }))}
          viewBox="0 0 2400 2400"
          {...rest}
        >
          <g
            strokeWidth={200}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
          >
            <path d="M1200 600L1200 100" />
            <path opacity={0.5} d="M1200 2300L1200 1800" />
            <path opacity={0.917} d="M900 680.4L650 247.4" />
            <path opacity={0.417} d="M1750 2152.6L1500 1719.6" />
            <path opacity={0.833} d="M680.4 900L247.4 650" />
            <path opacity={0.333} d="M2152.6 1750L1719.6 1500" />
            <path opacity={0.75} d="M600 1200L100 1200" />
            <path opacity={0.25} d="M2300 1200L1800 1200" />
            <path opacity={0.667} d="M680.4 1500L247.4 1750" />
            <path opacity={0.167} d="M2152.6 650L1719.6 900" />
            <path opacity={0.583} d="M900 1719.6L650 2152.6" />
            <path opacity={0.083} d="M1750 247.4L1500 680.4" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
              values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
              dur="0.83333s"
              begin="0s"
              repeatCount="indefinite"
              calcMode="discrete"
            />
          </g>
        </svg>
        {/* Hidden text for screen readers */}
        <span className="sr-only">{ariaLabel || "Loading..."}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
export default Spinner;
