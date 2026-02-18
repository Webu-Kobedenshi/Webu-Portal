import { cn } from "@/lib/cn";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-stone-200/80 bg-white/90 px-3 text-sm text-stone-900 outline-none transition-all duration-200 hover:border-stone-300 focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:border-stone-600 dark:focus:border-violet-500/60 dark:focus:bg-stone-900 dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
