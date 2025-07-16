import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type ImportVTEXDialogProps = {
  open: boolean
  onClose: () => void
  onImport: () => void
  loading?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export function ImportVTEXDialog({
  open,
  onClose,
  onImport,
  loading = false,
  title = "Import from VTEX",
  description = "Import all products from your connected VTEX store into your catalog. Existing products will be skipped.",
  confirmText = "Import Products",
  cancelText = "Cancel",
}: ImportVTEXDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={onImport} disabled={loading}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 