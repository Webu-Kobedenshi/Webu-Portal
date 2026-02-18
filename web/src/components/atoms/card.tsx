import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <article
      className={cn("liquid-glass rounded-2xl p-5 transition-all duration-300", className)}
      {...props}
    />
  );
}
