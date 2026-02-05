"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
    { name: "destructive", var: "--destructive" },
    { name: "destructive-foreground", var: "--destructive-foreground" },
    { name: "border", var: "--border" },
    { name: "input", var: "--input" },
    { name: "ring", var: "--ring" },
  ]

  const semanticColors = [
    { name: "success", var: "--success" },
    { name: "success-foreground", var: "--success-foreground" },
    { name: "warning", var: "--warning" },
    { name: "warning-foreground", var: "--warning-foreground" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors.map((color) => (
            <Card key={color.var} className="p-4">
              <div
                className="h-20 rounded-md mb-2 border"
                style={{ backgroundColor: `hsl(var(${color.var}))` }}
              />
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground">{color.var}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Semantic Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {semanticColors.map((color) => (
            <Card key={color.var} className="p-4">
              <div
                className="h-20 rounded-md mb-2 border"
                style={{ backgroundColor: `hsl(var(${color.var}))` }}
              />
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground">{color.var}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Chart Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Chart Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {chartColors.map((color) => (
            <Card key={color.var} className="p-4">
              <div
                className="h-20 rounded-md mb-2 border"
                style={{ backgroundColor: `hsl(var(${color.var}))` }}
              />
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground">{color.var}</p>
            </Card>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="h-20 bg-primary rounded-none mb-2" />
            <p className="text-sm font-medium">None</p>
            <p className="text-xs text-muted-foreground">rounded-none</p>
          </Card>
          <Card className="p-4">
            <div className="h-20 bg-primary rounded-sm mb-2" />
            <p className="text-sm font-medium">Small</p>
            <p className="text-xs text-muted-foreground">rounded-sm</p>
          </Card>
          <Card className="p-4">
            <div className="h-20 bg-primary rounded-md mb-2" />
            <p className="text-sm font-medium">Medium</p>
            <p className="text-xs text-muted-foreground">rounded-md</p>
          </Card>
          <Card className="p-4">
            <div className="h-20 bg-primary rounded-lg mb-2" />
            <p className="text-sm font-medium">Large</p>
            <p className="text-xs text-muted-foreground">rounded-lg</p>
          </Card>
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Shadows</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="h-20 bg-card shadow-sm mb-2 border rounded-md" />
            <p className="text-sm font-medium">Small</p>
            <p className="text-xs text-muted-foreground">shadow-sm</p>
          </Card>
          <Card className="p-4">
            <div className="h-20 bg-card shadow-md mb-2 border rounded-md" />
            <p className="text-sm font-medium">Medium</p>
            <p className="text-xs text-muted-foreground">shadow-md</p>
          </Card>
          <Card className="p-4">
            <div className="h-20 bg-card shadow-lg mb-2 border rounded-md" />
            <p className="text-sm font-medium">Large</p>
            <p className="text-xs text-muted-foreground">shadow-lg</p>
          </Card>
          <Card className="p-4">
            <div className="h-20 bg-card shadow-xl mb-2 border rounded-md" />
            <p className="text-sm font-medium">Extra Large</p>
            <p className="text-xs text-muted-foreground">shadow-xl</p>
          </Card>
        </div>
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
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Card Title</h4>
              <p className="text-sm text-muted-foreground">
                Card description goes here with some example content.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Card Title</h4>
              <p className="text-sm text-muted-foreground">
                Card description goes here with some example content.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Card Title</h4>
              <p className="text-sm text-muted-foreground">
                Card description goes here with some example content.
              </p>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Alerts</h3>
          <div className="space-y-3">
            <Alert>
              <p className="text-sm">Default alert message</p>
            </Alert>
            <Alert variant="destructive">
              <p className="text-sm">Destructive alert message</p>
            </Alert>
          </div>
        </div>

        {/* Radio Group */}
        <div>
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
      </section>
    </div>
  )
}
