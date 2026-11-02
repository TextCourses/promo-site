import { useState, type ReactElement, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export interface ProofLightboxProps {
  children: ReactNode
  description?: string
  title: string
  trigger: ReactElement
}

/**
 * Accessible preview for a user-supplied proof asset. The caller owns the
 * MediaSlot on both the trigger and the enlarged view, so the Media tab keeps
 * one stable asset id while the dialog owns keyboard focus and dismissal.
 */
export function ProofLightbox({
  children,
  description,
  title,
  trigger,
}: ProofLightboxProps): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] max-w-4xl gap-5 overflow-y-auto border-border bg-bg p-4 shadow-xl sm:p-6"
        showCloseButton={false}
      >
        <div className="flex items-start justify-between gap-4">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-xl leading-tight text-fg sm:text-2xl">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="max-w-2xl text-sm leading-relaxed text-muted">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="outline" className="min-h-11 shrink-0" type="button">
              Закрыть
            </Button>
          </DialogClose>
        </div>
        <div className="grid min-h-0 place-items-center bg-surface p-2 sm:p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProofLightbox
