import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50 aria-invalid:border-danger aria-invalid:ring-danger/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-on [a&]:hover:bg-accent/90",
        secondary:
          "bg-surface text-fg [a&]:hover:bg-surface/90",
        destructive:
          "bg-danger text-accent-on focus-visible:ring-danger/20 [a&]:hover:bg-danger/90",
        outline:
          "border-border text-fg [a&]:hover:bg-surface-2 [a&]:hover:text-fg",
        ghost: "[a&]:hover:bg-surface-2 [a&]:hover:text-fg",
        link: "text-accent underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
