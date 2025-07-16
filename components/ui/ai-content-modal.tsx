import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Wand2, Copy, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export type Campaign = {
  id: string
  campaign_name: string
}

export type GeneratedContent = Record<string, string>
export type QualityMetrics = Record<string, {
  qualityScore: number
  brandCompliance: number
  readability: number
}>

export type AIContentModalProps = {
  open: boolean
  onClose: () => void
  product: { product_name: string; master_description?: string; page_title?: string; meta_description?: string; product_url?: string }
  campaigns: Campaign[]
  selectedCampaignId: string
  setSelectedCampaignId: (id: string) => void
  generatedContent: string | null
  qualityMetrics: {
    qualityScore: number
    brandCompliance: number
    readability: number
  } | null
  loading: boolean
  totalTokens?: number
  onGenerate: (languageCode: string) => void
  onApply: () => void
  seoSuggestions?: {
    page_title?: string
    meta_description?: string
    product_url?: string
  }
  appliedSeo?: {
    page_title?: string
    meta_description?: string
    product_url?: string
  }
  setAppliedSeo?: (fields: { page_title?: string; meta_description?: string; product_url?: string }) => void
  applySeoFlags?: {
    page_title?: boolean
    meta_description?: boolean
    product_url?: boolean
  }
  setApplySeoFlags?: (flags: { page_title?: boolean; meta_description?: boolean; product_url?: boolean }) => void
}

export function AIContentModal({
  open,
  onClose,
  product,
  campaigns,
  selectedCampaignId,
  setSelectedCampaignId,
  generatedContent,
  qualityMetrics,
  loading,
  totalTokens = 0,
  onGenerate,
  onApply,
  seoSuggestions = {},
  appliedSeo = {},
  setAppliedSeo = () => {},
  applySeoFlags = {},
  setApplySeoFlags = () => {},
}: AIContentModalProps) {
  const [copied, setCopied] = React.useState<boolean>(false)
  const [languageCode, setLanguageCode] = React.useState<string>("en")
  const { toast } = useToast()

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast({ title: "Copied!", description: "Content copied to clipboard." })
    setTimeout(() => setCopied(false), 1200)
  }

  // Remove emojis from a string (broad, ES5-compatible)
  const stripEmojis = (str: string) => str.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\u2600-\u27BF]/g, '')

  // SEO field handlers
  const handleSeoInput = (field: 'page_title' | 'meta_description' | 'product_url', value: string) => {
    setAppliedSeo({ ...appliedSeo, [field]: value })
    setApplySeoFlags({ ...applySeoFlags, [field]: true })
  }
  const handleSeoApply = (field: 'page_title' | 'meta_description' | 'product_url') => {
    setApplySeoFlags({ ...applySeoFlags, [field]: true })
    if (!appliedSeo[field]) setAppliedSeo({ ...appliedSeo, [field]: seoSuggestions[field] || '' })
  }
  const handleSeoIgnore = (field: 'page_title' | 'meta_description' | 'product_url') => {
    setApplySeoFlags({ ...applySeoFlags, [field]: false })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-none sm:rounded-xl">
        <DialogHeader>
          <DialogTitle>Generate AI Content</DialogTitle>
          <DialogDescription>
            Generate AI-powered product descriptions using your brand voice and campaign context.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Product Info */}
          <Card className="shadow-sm">
            <CardContent className="px-4 py-3 sm:px-6 sm:py-4">
              <h3 className="text-base sm:text-xl font-bold mb-1">{product.product_name}</h3>
              {/* --- Current Data --- */}
              <div className="mt-4 mb-2 p-3 rounded bg-muted/30 border border-muted-200">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-semibold text-muted-foreground min-w-[110px]">Current Description:</span>
                    <span className="text-xs text-foreground break-all">{product.master_description || <span className="italic text-muted-foreground">(none)</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-semibold text-muted-foreground min-w-[110px]">Current Page Title:</span>
                    <span className="text-xs text-foreground break-all">{product.page_title || <span className="italic text-muted-foreground">(none)</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-semibold text-muted-foreground min-w-[110px]">Current Meta Description:</span>
                    <span className="text-xs text-foreground break-all">{product.meta_description || <span className="italic text-muted-foreground">(none)</span>}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-semibold text-muted-foreground min-w-[110px]">Current Product URL:</span>
                    <span className="text-xs text-foreground break-all">{product.product_url || <span className="italic text-muted-foreground">(none)</span>}</span>
                  </div>
                </div>
              </div>
              {/* --- End Current Data --- */}
            </CardContent>
          </Card>
          <hr className="my-4 border-muted-200" />
          {/* Campaign Selection */}
          <div className="mb-2">
            <label className="block text-xs text-muted-foreground mb-1">Campaign Context (Optional)</label>
            <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign or use default brand voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Brand Voice</SelectItem>
                {campaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.campaign_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Language Selection with emotional design */}
          <div className="mb-2">
            <label className="block text-xs text-muted-foreground mb-1">Language <span role="img" aria-label="language">🌍</span></label>
            <Select value={languageCode} onValueChange={setLanguageCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="pt">🇧🇷 Português</SelectItem>
                {/* Add more languages as needed */}
              </SelectContent>
            </Select>
          </div>
          {/* Generate Button */}
          {!generatedContent && (
            <Button 
              onClick={() => {
                onGenerate(languageCode)
                toast({ title: "Generating...", description: "AI is generating content." })
              }}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          )}
          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Generated Description</h3>
                {totalTokens > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Tokens used: {totalTokens}
                  </div>
                )}
              </div>
              <Card className="shadow-sm">
                <CardContent className="relative px-4 py-3 sm:px-6 sm:py-4">
                  {/* Copy button */}
                  <button
                    type="button"
                    className="absolute top-3 right-3 p-1 rounded hover:bg-muted transition"
                    onClick={() => handleCopy(stripEmojis(generatedContent))}
                    aria-label="Copy content"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="mb-3">
                    <div className="flex flex-wrap items-start gap-2">
                      <Badge className="bg-orange-500 text-white">
                        Quality: {Math.round((qualityMetrics?.qualityScore || 0) * 100)}%
                      </Badge>
                      <Badge variant="outline">
                        Brand: {Math.round((qualityMetrics?.brandCompliance || 0) * 100)}%
                      </Badge>
                      <Badge variant="outline">
                        Read: {Math.round((qualityMetrics?.readability || 0) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-muted rounded p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground overflow-auto max-h-40">
                    {stripEmojis(generatedContent)}
                  </div>
                </CardContent>
              </Card>
              {/* --- SEO SUGGESTIONS SECTION --- */}
              <div className="mt-6 p-4 border rounded">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <div className="font-semibold text-sm text-muted-foreground">SEO Suggestions</div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setAppliedSeo({
                        page_title: seoSuggestions.page_title ?? '',
                        meta_description: seoSuggestions.meta_description ?? '',
                        product_url: seoSuggestions.product_url ?? '',
                      })
                      setApplySeoFlags({
                        page_title: true,
                        meta_description: true,
                        product_url: true,
                      })
                    }}
                    className="w-full sm:w-auto"
                  >
                    Apply All
                  </Button>
                </div>
                {/* Make grid horizontally scrollable on mobile, but take full width on desktop */}
                <div className="-mx-4 sm:mx-0 overflow-x-auto pb-2 w-full flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[600px] sm:min-w-0 px-4 sm:px-0 w-full md:max-w-none">
                    {/* Page Title */}
                    <div className="flex flex-col gap-1 min-w-[220px] h-full md:min-h-[180px] rounded shadow-sm p-2 md:flex-1">
                      <label className="block text-xs font-medium mb-1">Page Title</label>
                      <input
                        className="w-full border rounded px-2 py-2 text-sm min-h-[40px]"
                        value={appliedSeo.page_title ?? seoSuggestions.page_title ?? ''}
                        onChange={e => handleSeoInput('page_title', e.target.value)}
                        placeholder="AI generated page title"
                        style={{height: '40px'}}
                      />
                      <div className="flex flex-row gap-2 mt-1 justify-center">
                        <Button size="sm" className="w-1/2 sm:w-auto" variant={applySeoFlags.page_title ? 'default' : 'outline'} onClick={() => handleSeoApply('page_title')}>Apply</Button>
                        <Button size="sm" className="w-1/2 sm:w-auto" variant={!applySeoFlags.page_title ? 'default' : 'outline'} onClick={() => handleSeoIgnore('page_title')}>Ignore</Button>
                      </div>
                    </div>
                    {/* Meta Description */}
                    <div className="flex flex-col gap-1 min-w-[220px] h-full md:min-h-[180px] rounded shadow-sm p-2 md:flex-1">
                      <label className="block text-xs font-medium mb-1">Meta Description</label>
                      <textarea
                        className="w-full border rounded px-2 py-2 text-sm resize-none min-h-[40px] max-h-[40px]"
                        rows={2}
                        value={appliedSeo.meta_description ?? seoSuggestions.meta_description ?? ''}
                        onChange={e => handleSeoInput('meta_description', e.target.value)}
                        placeholder="AI generated meta description"
                        style={{height: '40px'}}
                      />
                      <div className="flex flex-row gap-2 mt-1 justify-center">
                        <Button size="sm" className="w-1/2 sm:w-auto" variant={applySeoFlags.meta_description ? 'default' : 'outline'} onClick={() => handleSeoApply('meta_description')}>Apply</Button>
                        <Button size="sm" className="w-1/2 sm:w-auto" variant={!applySeoFlags.meta_description ? 'default' : 'outline'} onClick={() => handleSeoIgnore('meta_description')}>Ignore</Button>
                      </div>
                    </div>
                    {/* Product URL */}
                    <div className="flex flex-col gap-1 min-w-[220px] h-full md:min-h-[180px] rounded shadow-sm p-2 md:flex-1">
                      <label className="block text-xs font-medium mb-1">Product URL</label>
                      <input
                        className="w-full border rounded px-2 py-2 text-sm min-h-[40px]"
                        value={appliedSeo.product_url ?? seoSuggestions.product_url ?? ''}
                        onChange={e => handleSeoInput('product_url', e.target.value)}
                        placeholder="AI generated product URL"
                        style={{height: '40px'}}
                      />
                      <div className="flex flex-row gap-2 mt-1 justify-center">
                        <Button size="sm" className="w-1/2 sm:w-auto" variant={applySeoFlags.product_url ? 'default' : 'outline'} onClick={() => handleSeoApply('product_url')}>Apply</Button>
                        <Button size="sm" className="w-1/2 sm:w-auto" variant={!applySeoFlags.product_url ? 'default' : 'outline'} onClick={() => handleSeoIgnore('product_url')}>Ignore</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">You can edit, apply, or ignore each SEO suggestion. Only applied fields will be saved.</div>
              </div>
              {/* --- END SEO SUGGESTIONS --- */}
              {/* Apply Button */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button 
                  onClick={onApply}
                  className="w-full sm:w-auto"
                >
                  Apply Description
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 