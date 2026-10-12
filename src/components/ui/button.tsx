"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// shadcn/ui Button, restyled for SHRY: square-ish, precise, accent-led.
const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-medium tracking-tight transition-[transform,background-color,color,border-color] duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-obsidian hover:bg-ink",
        ghost: "text-ink border border-line hover:border-ink/60",
        link: "text-mute hover:text-ink underline-offset-8 hover:underline px-0",
        dark: "bg-obsidian text-ink hover:bg-surface2",
      },
      size: {
        md: "h-12 px-6 text-[0.95rem] rounded-full",
        lg: "h-14 px-8 text-base rounded-full",
        sm: "h-10 px-5 text-sm rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";
