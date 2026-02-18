import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-stone-200/80 bg-white/90 px-3.5 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 hover:border-stone-300 focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-violet-500/60 dark:focus:bg-stone-900 dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
