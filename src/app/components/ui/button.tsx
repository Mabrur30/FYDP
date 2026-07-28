import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-500/20 active:translate-y-0.5 aria-invalid:ring-rose-500/20",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0",
        destructive:
          "bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-500/25",
        outline:
          "border border-slate-300 bg-white text-slate-700 shadow-sm shadow-slate-100 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md",
        secondary:
          "bg-slate-100 text-slate-800 shadow-sm shadow-slate-100 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-md",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2.5 has-[>svg]:px-3",
        sm: "h-9 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-2xl px-6 has-[>svg]:px-4",
        icon: "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  const { type, ...rest } = props as any;

  return (
    <Comp
      data-slot="button"
      type={type ?? "button"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    />
  );
}

export { Button, buttonVariants };
