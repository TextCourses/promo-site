"use client"

import * as React from "react"
import {
  CheckCircle2 as CircleCheckIcon,
  Info as InfoIcon,
  Loader2 as Loader2Icon,
  OctagonX as OctagonXIcon,
  TriangleAlert as TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-bg)",
          "--normal-text": "var(--color-fg)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "var(--radius-md, 6px)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
