import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "secondary";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  default:
    "border-violet-200/80 bg-violet-50/80 text-violet-700 dark:border-violet-700/50 dark:bg-violet-900/30 dark:text-violet-300",
  secondary:
    "border-stone-200/80 bg-white/70 text-stone-600 dark:border-stone-700/60 dark:bg-stone-900/50 dark:text-stone-300",
};

export function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
