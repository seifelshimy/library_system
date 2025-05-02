import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

const buttonVariants = cva("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none", {
  variants: {
    variant: {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
      secondary: "bg-gray-100 text-black hover:bg-gray-200",
    }
  },
  defaultVariants: {
    variant: "default",
  }
});

const Button = React.forwardRef(({ className = "", variant = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={`${buttonVariants({ variant })} ${className}`}
      {...props}
    />
  );
});

Button.displayName = "Button";
export { Button };
