"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-[6px] border border-slate-300 bg-white text-white shadow-sm shadow-slate-100 transition-all duration-200 outline-none focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-500/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:shadow-blue-500/20 aria-invalid:border-rose-500 aria-invalid:ring-4 aria-invalid:ring-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-transform duration-200 data-[state=checked]:scale-100"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
