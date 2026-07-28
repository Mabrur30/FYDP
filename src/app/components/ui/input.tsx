import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-100 transition-all duration-200 file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-700 placeholder:text-slate-400 selection:bg-blue-100 selection:text-slate-900 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-500/20",
        "aria-invalid:border-rose-500 aria-invalid:ring-4 aria-invalid:ring-rose-500/10",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
