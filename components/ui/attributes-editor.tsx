"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Tag } from "lucide-react"

export interface Attribute {
  key: string
  value: string | boolean | number
  type: 'text' | 'boolean' | 'number' | 'select'
  options?: string[] // For select type
}

interface AttributesEditorProps {
  attributes: Record<string, any>
  onChange: (attributes: Record<string, any>) => void
  className?: string
}

export function AttributesEditor({ attributes, onChange, className }: AttributesEditorProps) {
  const [newKey, setNewKey] = React.useState("")
  const [newValue, setNewValue] = React.useState("")
  const [newType, setNewType] = React.useState<'text' | 'boolean' | 'number' | 'select'>('text')
  const [newOptions, setNewOptions] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)

  // Convert attributes object to array format for easier editing
  const attributesArray = React.useMemo(() => {
    return Object.entries(attributes).map(([key, value]) => ({
      key,
      value,
      type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text'
    }))
  }, [attributes])

  const addAttribute = () => {
    if (!newKey.trim()) return

    let processedValue: any = newValue
    
    // Process value based on type
    switch (newType) {
      case 'boolean':
        processedValue = newValue === 'true'
        break
      case 'number':
        processedValue = parseFloat(newValue) || 0
        break
      case 'select':
        processedValue = newValue
        break
      default:
        processedValue = newValue
    }

    const updatedAttributes = {
      ...attributes,
      [newKey.trim()]: processedValue
    }
    
    onChange(updatedAttributes)
    setNewKey("")
    setNewValue("")
    setNewType('text')
    setNewOptions("")
    setIsAdding(false)
  }

  const removeAttribute = (key: string) => {
    const { [key]: removed, ...rest } = attributes
    onChange(rest)
  }

  const updateAttribute = (key: string, value: any) => {
    const updatedAttributes = {
      ...attributes,
      [key]: value
    }
    onChange(updatedAttributes)
  }

  const renderAttributeValue = (key: string, value: any, type: string) => {
    switch (type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === true}
              onCheckedChange={(checked: boolean) => updateAttribute(key, checked)}
            />
            <span className="text-sm">{value ? 'Yes' : 'No'}</span>
          </div>
        )
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateAttribute(key, parseFloat(e.target.value) || 0)}
            className="w-24"
          />
        )
      default:
        return (
          <Input
            value={value}
            onChange={(e) => updateAttribute(key, e.target.value)}
            placeholder="Enter value"
          />
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Tag className="h-4 w-4" />
          Product Attributes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Existing Attributes */}
        {attributesArray.length > 0 && (
          <div className="space-y-2">
            {attributesArray.map(({ key, value, type }) => (
              <div key={key} className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {key}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {type}
                    </Badge>
                  </div>
                  {renderAttributeValue(key, value, type)}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAttribute(key)}
                  className="ml-2 text-red-500 hover:text-red-700 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Attribute */}
        {isAdding ? (
          <div className="space-y-2 p-3 border rounded-md bg-muted/20">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="new-key" className="text-xs font-medium">
                  Attribute Name
                </Label>
                <Input
                  id="new-key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g., color, brand, size"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="new-type" className="text-xs font-medium">
                  Type
                </Label>
                <Select value={newType} onValueChange={(value: any) => setNewType(value)}>
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newType === 'select' && (
              <div>
                <Label htmlFor="new-options" className="text-xs font-medium">
                  Options (comma-separated)
                </Label>
                <Input
                  id="new-options"
                  value={newOptions}
                  onChange={(e) => setNewOptions(e.target.value)}
                  placeholder="e.g., Small, Medium, Large"
                  className="mt-1 h-8 text-sm"
                />
              </div>
            )}

            {newType === 'select' && newOptions ? (
              <div>
                <Label htmlFor="new-value" className="text-xs font-medium">
                  Default Value
                </Label>
                <Select value={newValue} onValueChange={setNewValue}>
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue placeholder="Select default value" />
                  </SelectTrigger>
                  <SelectContent>
                    {newOptions.split(',').map((option) => (
                      <SelectItem key={option.trim()} value={option.trim()}>
                        {option.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : newType !== 'select' && (
              <div>
                <Label htmlFor="new-value" className="text-xs font-medium">
                  Value
                </Label>
                {newType === 'boolean' ? (
                  <Select value={newValue} onValueChange={setNewValue}>
                    <SelectTrigger className="mt-1 h-8 text-sm">
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="new-value"
                    type={newType === 'number' ? 'number' : 'text'}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={`Enter ${newType} value`}
                    className="mt-1 h-8 text-sm"
                  />
                )}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={addAttribute} disabled={!newKey.trim()} className="h-7 text-xs">
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)} className="h-7 text-xs">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full h-8 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Attribute
          </Button>
        )}

        {attributesArray.length === 0 && !isAdding && (
          <div className="text-center py-4 text-muted-foreground">
            <Tag className="h-6 w-6 mx-auto mb-1 opacity-50" />
            <p className="text-xs">No attributes added yet</p>
            <p className="text-xs text-muted-foreground">Add attributes like color, size, brand, etc.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 