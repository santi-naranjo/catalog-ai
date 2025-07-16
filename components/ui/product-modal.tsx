import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AttributesEditor } from "@/components/ui/attributes-editor"
import type { Product, ProductVariant, ProductLocalization } from "../../lib/mock-data";
import { useState } from "react";

export type ProductModalProps = {
  open: boolean
  editing?: boolean
  form: Product & {
    // For now, keep base fields editable; variants/localizations UI to be added
    base_price: string | number | undefined
    product_url?: string
    page_title?: string
    meta_description?: string
  }
  onChange: (form: ProductModalProps["form"]) => void
  onClose: () => void
  onSave: () => void
}

export function ProductModal({
  open,
  editing = false,
  form,
  onChange,
  onClose,
  onSave,
}: ProductModalProps) {
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...form, [e.target.name]: e.target.value })
  }

  // Local state for new variant/localization
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({ sku: "" });
  const [newLocalization, setNewLocalization] = useState<Partial<ProductLocalization>>({ language_code: "" });

  // Handlers for variants
  const addVariant = () => {
    if (!newVariant.sku) return;
    onChange({
      ...form,
      variants: [...(form.variants || []), { ...newVariant, id: crypto.randomUUID() } as ProductVariant],
    });
    setNewVariant({ sku: "" });
  };
  const removeVariant = (id: string) => {
    onChange({ ...form, variants: (form.variants || []).filter(v => v.id !== id) });
  };

  // Handlers for localizations
  const addLocalization = () => {
    if (!newLocalization.language_code) return;
    onChange({
      ...form,
      localizations: [...(form.localizations || []), { ...newLocalization, id: crypto.randomUUID() } as ProductLocalization],
    });
    setNewLocalization({ language_code: "" });
  };
  const removeLocalization = (id: string) => {
    onChange({ ...form, localizations: (form.localizations || []).filter(l => l.id !== id) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the product details." : "Enter details for the new product."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input
              name="product_name"
              value={form.product_name}
              onChange={handleFormChange}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="master_description"
              value={form.master_description}
              onChange={handleFormChange}
              placeholder="Enter a detailed product description that highlights key features, benefits, and specifications..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This description will be used for AI content generation and platform publishing.
            </p>
          </div>
          {/* SEO/AI Enhancement Fields (Editable) */}
          <div className="mt-4 p-4 bg-muted/40 rounded border">
            <div className="font-semibold mb-2 text-sm text-muted-foreground">SEO / AI Enhancement</div>
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">Product URL</label>
              <Input
                name="product_url"
                value={form.product_url || ''}
                onChange={handleFormChange}
                placeholder="SEO optimized product URL"
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">Page Title</label>
              <Input
                name="page_title"
                value={form.page_title || ''}
                onChange={handleFormChange}
                placeholder="SEO optimized page title"
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">Meta Description</label>
              <Textarea
                name="meta_description"
                value={form.meta_description || ''}
                onChange={handleFormChange}
                placeholder="SEO meta description"
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2">These fields are imported for SEO and AI product enhancement, but you can edit them as needed.</div>
          </div>
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Base Price</label>
              <Input
                name="base_price"
                type="number"
                step="0.01"
                value={form.base_price}
                onChange={handleFormChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <AttributesEditor
              attributes={form.attributes as Record<string, any> || {}}
              onChange={attributes => onChange({ ...form, attributes })}
              className="border-0 shadow-none bg-muted/20"
            />
          </div> */}
          {/* Variants management - Read Only */}
          <div className="mt-4 p-4 bg-muted/40 rounded border">
            <div className="font-semibold mb-2 text-sm text-muted-foreground">Product Variants</div>
            {(form.variants || []).length > 0 ? (
              <div className="space-y-2">
                {(form.variants || []).map(variant => (
                  <div key={variant.id} className="flex items-center gap-2 p-2 bg-background rounded border">
                    <span className="text-xs font-medium">SKU: <span className="font-normal">{variant.sku}</span></span>
                    {variant.image_url && (
                      <img src={variant.image_url} alt={variant.sku} className="w-6 h-6 object-cover rounded" />
                    )}
                    {variant.price_override && (
                      <span className="text-xs text-muted-foreground">
                        Price: ${variant.price_override}
                      </span>
                    )}
                    {variant.stock_quantity !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        Stock: {variant.stock_quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">No variants configured</div>
            )}
            <div className="text-xs text-muted-foreground mt-2">Variants are imported from connected platforms and managed automatically.</div>
          </div>
          {/* Localizations management */}
          <div className="border-t pt-4">
            <div className="font-semibold mb-2">Localizations</div>
            <ul className="mb-2">
              {(form.localizations || []).map(loc => (
                <li key={loc.id} className="flex items-center gap-2 mb-1">
                  <span className="text-xs">Lang: <b>{loc.language_code}</b></span>
                  {loc.localized_name && <span className="text-xs ml-2">Name: {loc.localized_name}</span>}
                  <Button size="sm" variant="destructive" onClick={() => removeLocalization(loc.id)}>Remove</Button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 items-center">
              <Input
                size={4}
                placeholder="Lang"
                value={newLocalization.language_code || ""}
                onChange={e => setNewLocalization({ ...newLocalization, language_code: e.target.value })}
              />
              <Input
                size={12}
                placeholder="Name"
                value={newLocalization.localized_name || ""}
                onChange={e => setNewLocalization({ ...newLocalization, localized_name: e.target.value })}
              />
              <Button size="sm" onClick={addLocalization}>Add Localization</Button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {editing ? "Update" : "Add"} Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 