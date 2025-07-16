import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export type Connection = {
  id: string
  platform: string
  store_name: string
}

export type PublishDialogProps = {
  open: boolean
  onClose: () => void
  onPublish: () => void
  connections: Connection[]
  selectedConnectionId: string
  setSelectedConnectionId: (id: string) => void
  scheduledPublishAt: string
  setScheduledPublishAt: (date: string) => void
  loading?: boolean
}

export function PublishDialog({
  open,
  onClose,
  onPublish,
  connections,
  selectedConnectionId,
  setSelectedConnectionId,
  scheduledPublishAt,
  setScheduledPublishAt,
  loading = false,
}: PublishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Product</DialogTitle>
          <DialogDescription>
            Choose a platform to publish this product to.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important:</p>
                <p>Publishing will update your product on the selected platform. These changes cannot be undone and will be visible to your customers immediately.</p>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={selectedConnectionId} onValueChange={setSelectedConnectionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {connections.map(connection => (
                  <SelectItem key={connection.id} value={connection.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{connection.platform}</span>
                      <span className="text-muted-foreground">({connection.store_name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="schedule">Publishing Schedule</Label>
            <Select value={scheduledPublishAt ? "scheduled" : "immediate"} onValueChange={value => {
              if (value === "immediate") {
                setScheduledPublishAt("")
              } else {
                setScheduledPublishAt(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
              }
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Publish immediately</SelectItem>
                <SelectItem value="scheduled">Schedule for later</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scheduledPublishAt && (
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                type="datetime-local"
                value={scheduledPublishAt.slice(0, 16)}
                onChange={e => setScheduledPublishAt(new Date(e.target.value).toISOString())}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onPublish} disabled={!selectedConnectionId || loading}>
            {scheduledPublishAt ? "Schedule Publish" : "Publish Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 