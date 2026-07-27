import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas hover:-translate-y-px active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-forest text-white shadow-subtle hover:bg-forest-hover hover:shadow-card active:bg-forest-active",
        secondary:
          "border border-border bg-surface text-ink shadow-subtle hover:bg-canvas-muted hover:shadow-card active:bg-canvas-muted",
        outline:
          "border border-border bg-transparent text-ink hover:bg-canvas-muted",
        ghost: "text-ink shadow-none hover:bg-canvas-muted hover:translate-y-0",
        link: "text-forest underline-offset-4 shadow-none hover:underline hover:translate-y-0",
        destructive:
          "bg-danger text-white shadow-subtle hover:opacity-90 hover:shadow-card",
      },
      size: {
        default: "h-10 px-4 py-2 [&_svg]:size-4",
        sm: "h-9 px-3 text-[13px] [&_svg]:size-3.5",
        lg: "h-12 rounded-md px-6 text-[15px] [&_svg]:size-4",
        icon: "h-10 w-10 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
