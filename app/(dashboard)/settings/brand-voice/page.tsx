"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function BrandVoicePage() {
  const [brandVoice, setBrandVoice] = React.useState("")
  const { toast } = useToast()

  const handleSave = () => {
    console.log("Brand Voice:", brandVoice)
    toast({
      title: "Brand Voice Saved!",
      description: "Your brand personality has been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brand Voice</h1>
        <p className="text-muted-foreground">
          Define your brand&apos;s unique personality. This persona will guide the AI to generate copy that is perfectly on-brand, every time.
        </p>
      </div>

      {/* Brand Voice Card */}
      <Card>
        <CardHeader>
          <CardTitle>AI Brand Persona</CardTitle>
          <CardDescription>
            Paste in examples of your marketing copy, describe your target audience, and detail your tone of voice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Our brand is confident and adventurous, targeting professionals aged 30-50. We use a rugged yet sophisticated tone..."
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            className="min-h-[300px]"
            rows={15}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Brand Voice</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 