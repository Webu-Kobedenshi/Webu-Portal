import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectSeparator as ShadcnSelectSeparator,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type * as React from "react";

function SelectTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnSelectTrigger>) {
  return (
    <ShadcnSelectTrigger
      className={cn(
        "h-10 w-full rounded-xl border border-stone-200/80 bg-white/90 px-3 text-sm text-stone-900 outline-none transition-all duration-200 hover:border-stone-300 focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:border-stone-600 dark:focus:border-violet-500/60 dark:focus:bg-stone-900 dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]",
        className,
      )}
      // biome-ignore lint/suspicious/noExplicitAny: React 19 types mismatch with Radix UI
      {...(props as any)}
    />
  );
}

const Select = ShadcnSelect;
const SelectGroup = ShadcnSelectGroup;
const SelectValue = ShadcnSelectValue;
const SelectContent = ShadcnSelectContent;
const SelectLabel = ShadcnSelectLabel;
const SelectItem = ShadcnSelectItem;
const SelectSeparator = ShadcnSelectSeparator;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
