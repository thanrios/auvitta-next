"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react"

export default function StyleguidePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const colors = [
    { name: "background", var: "--background" },
    { name: "foreground", var: "--foreground" },
    { name: "card", var: "--card" },
    { name: "card-foreground", var: "--card-foreground" },
    { name: "popover", var: "--popover" },
    { name: "popover-foreground", var: "--popover-foreground" },
    { name: "primary", var: "--primary" },
    { name: "primary-foreground", var: "--primary-foreground" },
    { name: "secondary", var: "--secondary" },
    { name: "secondary-foreground", var: "--secondary-foreground" },
    { name: "muted", var: "--muted" },
    { name: "muted-foreground", var: "--muted-foreground" },
    { name: "accent", var: "--accent" },
    { name: "accent-foreground", var: "--accent-foreground" },
    { name: "border", var: "--border" },
    { name: "input", var: "--input" },
    { name: "ring", var: "--ring" },
  ]

  const semanticColors = [
    { name: "success", var: "--success" },
    { name: "success-foreground", var: "--success-foreground" },
    { name: "warning", var: "--warning" },
    { name: "warning-foreground", var: "--warning-foreground" },
    { name: "destructive", var: "--destructive" },
    { name: "destructive-foreground", var: "--destructive-foreground" },
    { name: "info", var: "--info" },
    { name: "info-foreground", var: "--info-foreground" },
  ]

  const chartColors = [
    { name: "chart-1", var: "--chart-1" },
    { name: "chart-2", var: "--chart-2" },
    { name: "chart-3", var: "--chart-3" },
    { name: "chart-4", var: "--chart-4" },
    { name: "chart-5", var: "--chart-5" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Design Tokens</h1>
          <p className="text-muted-foreground">
            Complete design system tokens and component examples
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          Toggle {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>
      </div>

      {/* Color Palette */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div key={color.var} className="space-y-2">
              <div
                className="h-24 rounded-lg border shadow-sm"
                style={{ backgroundColor: `var(${color.var})` }}
              />
              <div>
                <p className="text-sm font-semibold">{color.name}</p>
                <p className="text-xs text-muted-foreground">{color.var}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Semantic Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {semanticColors.map((color) => (
            <div key={color.var} className="space-y-2">
              <div
                className="h-24 rounded-lg border shadow-sm"
                style={{ backgroundColor: `var(${color.var})` }}
              />
              <div>
                <p className="text-sm font-semibold">{color.name}</p>
                <p className="text-xs text-muted-foreground">{color.var}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Chart Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {chartColors.map((color) => (
            <div key={color.var} className="space-y-2">
              <div
                className="h-24 rounded-lg border shadow-sm"
                style={{ backgroundColor: `var(${color.var})` }}
              />
              <div>
                <p className="text-sm font-semibold">{color.name}</p>
                <p className="text-xs text-muted-foreground">{color.var}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <Card className="p-6 space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <p className="text-sm text-muted-foreground">text-3xl font-bold</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <p className="text-sm text-muted-foreground">text-2xl font-bold</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Heading 4</h4>
            <p className="text-sm text-muted-foreground">text-xl font-semibold</p>
          </div>
          <div>
            <p className="text-base">
              Body text - The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-sm text-muted-foreground">text-base</p>
          </div>
          <div>
            <p className="text-sm">
              Small text - The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-xs text-muted-foreground">text-sm</p>
          </div>
        </Card>
      </section>

      {/* Border Radius */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Border Radius</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-primary rounded-none border-2 border-border mx-auto" />
              <p className="text-sm font-medium">None</p>
              <p className="text-xs text-muted-foreground">0px</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-primary rounded-sm border-2 border-border mx-auto" />
              <p className="text-sm font-medium">Small</p>
              <p className="text-xs text-muted-foreground">0.125rem</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-primary rounded-md border-2 border-border mx-auto" />
              <p className="text-sm font-medium">Medium</p>
              <p className="text-xs text-muted-foreground">0.375rem</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-primary rounded-lg border-2 border-border mx-auto" />
              <p className="text-sm font-medium">Large</p>
              <p className="text-xs text-muted-foreground">1.25rem</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-primary rounded-full border-2 border-border mx-auto" />
              <p className="text-sm font-medium">Full</p>
              <p className="text-xs text-muted-foreground">9999px</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Shadows</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-card shadow-sm border rounded-lg mx-auto" />
              <p className="text-sm font-medium">Small</p>
              <p className="text-xs text-muted-foreground">shadow-sm</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-card shadow-md border rounded-lg mx-auto" />
              <p className="text-sm font-medium">Medium</p>
              <p className="text-xs text-muted-foreground">shadow-md</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-card shadow-lg border rounded-lg mx-auto" />
              <p className="text-sm font-medium">Large</p>
              <p className="text-xs text-muted-foreground">shadow-lg</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-card shadow-xl border rounded-lg mx-auto" />
              <p className="text-sm font-medium">Extra Large</p>
              <p className="text-xs text-muted-foreground">shadow-xl</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 bg-card shadow-2xl border rounded-lg mx-auto" />
              <p className="text-sm font-medium">2X Large</p>
              <p className="text-xs text-muted-foreground">shadow-2xl</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Components */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Components</h2>

        {/* Buttons */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Badges</h3>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-2">
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-sm text-muted-foreground">
                Card with standard border and background styling.
              </p>
            </Card>
            <Card className="p-6 shadow-lg">
              <h4 className="font-semibold mb-2">Elevated Card</h4>
              <p className="text-sm text-muted-foreground">
                Card with larger shadow for elevated appearance.
              </p>
            </Card>
            <Card className="p-6 bg-accent">
              <h4 className="font-semibold mb-2">Accent Card</h4>
              <p className="text-sm text-muted-foreground">
                Card with accent background color variant.
              </p>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Alerts</h3>
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Default Alert</p>
                <p className="text-sm">This is a default informational message.</p>
              </div>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-sm">Your changes have been saved successfully.</p>
              </div>
            </Alert>
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Warning</p>
                <p className="text-sm">Please review your information before proceeding.</p>
              </div>
            </Alert>
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Error</p>
                <p className="text-sm">An error occurred while processing your request.</p>
              </div>
            </Alert>
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Information</p>
                <p className="text-sm">Here's some helpful information for you.</p>
              </div>
            </Alert>
          </div>
        </div>

        {/* Radio Group */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Radio Group</h3>
          <RadioGroup defaultValue="option-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-1" id="option-1" />
              <Label htmlFor="option-1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-2" id="option-2" />
              <Label htmlFor="option-2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-3" id="option-3" />
              <Label htmlFor="option-3">Option 3</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Inputs */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Inputs</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="input-default">Default Input</Label>
              <Input id="input-default" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-email">Email Input</Label>
              <Input id="input-email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-password">Password Input</Label>
              <Input id="input-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Disabled Input</Label>
              <Input id="input-disabled" placeholder="Disabled" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-with-value">Input with Value</Label>
              <Input id="input-with-value" defaultValue="Example value" />
            </div>
          </div>
        </div>
      </section>

      {/* Design Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Design Summary</h2>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Primary Color</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary border" />
                <div>
                  <p className="text-sm font-medium">Purple</p>
                  <p className="text-xs text-muted-foreground">oklch(0.5854 0.2041 277.1173)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Font Family</h3>
              <p className="text-sm">Plus Jakarta Sans</p>
              <p className="text-xs text-muted-foreground">Google Fonts - Sans Serif</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Border Radius</h3>
              <p className="text-sm">1.25rem (20px)</p>
              <p className="text-xs text-muted-foreground">Rounded corners throughout</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Style</h3>
              <p className="text-sm">Modern & Friendly</p>
              <p className="text-xs text-muted-foreground">Clean design with vibrant purple accents</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Overall Feel</h3>
              <p className="text-sm text-muted-foreground">
                A contemporary design system featuring a vibrant purple primary color palette,
                generous rounded corners (1.25rem), and the Plus Jakarta Sans typeface.
                The design emphasizes clarity and friendliness with well-defined semantic colors
                for success (green), warning (yellow/orange), and info (blue) states.
                Subtle shadows and smooth transitions create a polished, professional appearance
                suitable for modern web applications.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
