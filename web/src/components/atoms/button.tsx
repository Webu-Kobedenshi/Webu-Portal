import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

export function Button({
  className,
  type = "button",
  ...props
}: ComponentProps<typeof ShadcnButton>) {
  return (
    <ShadcnButton
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-semibold text-white transition-all duration-200 hover:from-violet-500 hover:to-fuchsia-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:from-violet-500 dark:to-fuchsia-500 dark:hover:from-violet-400 dark:hover:to-fuchsia-400",
        className,
      )}
      {...props}
    />
  );
}
