import { Card as ShadcnCard } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<typeof ShadcnCard>) {
  return (
    <ShadcnCard
      className={cn("liquid-glass rounded-2xl p-5 transition-all duration-300", className)}
      {...props}
    />
  );
}
