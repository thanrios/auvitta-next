"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ToastShowcase() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Toast (Sonner)</h1>
        <p className="text-muted-foreground">
          Display toast notifications to your users. Built on top of Sonner library.
        </p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success"></div>
            <span className="text-sm">Success (Verde)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive"></div>
            <span className="text-sm">Error (Vermelho)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning"></div>
            <span className="text-sm">Warning (Amarelo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-info"></div>
            <span className="text-sm">Info (Azul)</span>
          </div>
        </div>
      </div>

      {/* Usage */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <Card className="p-6">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { toast } from "sonner"

// Default toast
toast("Event has been created")

// Success toast
toast.success("Successfully saved!")

// Info toast
toast.info("Be at the area 10 minutes before the event time")

// Warning toast
toast.warning("Event start time cannot be earlier than 8am")

// Error toast
toast.error("Something went wrong")

// Promise toast
toast.promise(promise, {
  loading: 'Loading...',
  success: (data) => {
    return \`\${data.name} has been added\`;
  },
  error: 'Error',
})`}</code>
          </pre>
        </Card>
      </section>

      {/* Default Toast */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Default Toast</h2>
        <p className="text-muted-foreground mb-4">
          A simple toast notification with a message.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => toast("Event has been created")}>
              Show Default Toast
            </Button>
            <Button
              onClick={() => toast("Event has been created", {
                description: "Monday, January 3rd at 6:00pm",
              })}
            >
              With Description
            </Button>
            <Button
              onClick={() => toast("Event has been created", {
                action: {
                  label: "Undo",
                  onClick: () => toast("Undo action clicked"),
                },
              })}
            >
              With Action
            </Button>
          </div>
        </Card>
      </section>

      {/* Success Toast */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Success Toast (Verde)</h2>
        <p className="text-muted-foreground mb-4">
          Display a success message to confirm an action.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="default"
              onClick={() => toast.success("Successfully saved!")}
            >
              Show Success Toast
            </Button>
            <Button
              variant="default"
              onClick={() => toast.success("Profile updated", {
                description: "Your changes have been saved successfully.",
              })}
            >
              With Description
            </Button>
          </div>
        </Card>
      </section>

      {/* Info Toast */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Info Toast (Azul)</h2>
        <p className="text-muted-foreground mb-4">
          Display informational messages.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="secondary"
              onClick={() => toast.info("New feature available")}
            >
              Show Info Toast
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast.info("Meeting reminder", {
                description: "Be at the area 10 minutes before the event time",
              })}
            >
              With Description
            </Button>
          </div>
        </Card>
      </section>

      {/* Warning Toast */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Warning Toast (Amarelo)</h2>
        <p className="text-muted-foreground mb-4">
          Display warning messages to alert users.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="outline"
              onClick={() => toast.warning("Please save your work")}
            >
              Show Warning Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.warning("Invalid time selected", {
                description: "Event start time cannot be earlier than 8am",
              })}
            >
              With Description
            </Button>
          </div>
        </Card>
      </section>

      {/* Error Toast */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Error Toast (Vermelho)</h2>
        <p className="text-muted-foreground mb-4">
          Display error messages when something goes wrong.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="destructive"
              onClick={() => toast.error("Something went wrong")}
            >
              Show Error Toast
            </Button>
            <Button
              variant="destructive"
              onClick={() => toast.error("Failed to save changes", {
                description: "There was a problem with your request.",
              })}
            >
              With Description
            </Button>
          </div>
        </Card>
      </section>

      {/* Promise Toast */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Promise Toast</h2>
        <p className="text-muted-foreground mb-4">
          Display loading, success, and error states for async operations.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => {
                const promise: Promise<{ name: string }> = new Promise((resolve) =>
                  setTimeout(() => resolve({ name: "John Doe" }), 2000)
                )

                toast.promise(promise, {
                  loading: 'Loading...',
                  success: (data: { name: string }) => {
                    return `${data.name} has been added`;
                  },
                  error: 'Error',
                })
              }}
            >
              Success Promise
            </Button>
            <Button
              onClick={() => {
                const promise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Failed to save")), 2000)
                )

                toast.promise(promise, {
                  loading: 'Saving...',
                  success: 'Data saved successfully',
                  error: 'Failed to save data',
                })
              }}
            >
              Error Promise
            </Button>
          </div>
        </Card>
      </section>

      {/* Custom Duration */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Duration</h2>
        <p className="text-muted-foreground mb-4">
          Control how long the toast is visible.
        </p>
        <Card className="p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => toast("This will disappear quickly", { duration: 1000 })}
            >
              1 Second
            </Button>
            <Button
              onClick={() => toast("This stays longer", { duration: 5000 })}
            >
              5 Seconds
            </Button>
            <Button
              onClick={() => toast("This stays until dismissed", { duration: Infinity })}
            >
              Infinite
            </Button>
          </div>
        </Card>
      </section>

      {/* Position Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Positioning</h2>
        <p className="text-muted-foreground mb-4">
          Note: The default position is top-right. To change globally, update the Toaster component in layout.tsx.
        </p>
        <Card className="p-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Current position: <span className="font-semibold">top-right</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Available positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
            </p>
          </div>
        </Card>
      </section>

      {/* Using with Forms */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Using with Forms and useEffect</h2>
        <p className="text-muted-foreground mb-4">
          Common pattern for showing toasts based on state changes in forms.
        </p>
        <Card className="p-6">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
            <code>{`import { useEffect } from 'react'
import { toast } from 'sonner'

function LoginForm() {
  const { login, loginError } = useAuth()

  // Show toast when error changes
  useEffect(() => {
    if (loginError) {
      toast.error(loginError)
    }
  }, [loginError])

  const handleSubmit = (data) => {
    login(data) // Error will be shown via useEffect
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// Success example
function UpdateProfile() {
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      toast.success('Profile updated successfully!')
    }
  }, [success])

  return ...
}`}</code>
          </pre>
        </Card>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <Card className="p-6">
          <ul className="space-y-3 list-disc list-inside">
            <li>Use <strong className="text-success">success</strong> toasts (green) for confirming successful actions (e.g., Data saved, Logged out successfully)</li>
            <li>Use <strong className="text-destructive">error</strong> toasts (red) for failures that need user attention (e.g., Failed to save, Invalid credentials)</li>
            <li>Use <strong className="text-warning">warning</strong> toasts (yellow) for important non-blocking messages (e.g., Session expiring soon)</li>
            <li>Use <strong className="text-info">info</strong> toasts (blue) for helpful information (e.g., New feature available)</li>
            <li>Use <strong>promise</strong> toasts for async operations to show loading/success/error states</li>
            <li>Keep messages concise and actionable</li>
            <li>Avoid showing too many toasts at once</li>
            <li>Use appropriate durations - longer for important messages, shorter for confirmations</li>
            <li>Use <code>useEffect</code> to trigger toasts based on state changes in forms</li>
            <li>Prefer toasts over inline alerts for transient messages</li>
            <li><strong>Color coding is automatic</strong> - just use the correct toast type and the color will be applied</li>
          </ul>
        </Card>
      </section>

      {/* Real-World Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Real-World Examples</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Authentication</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li><code>{'toast.error("Invalid email or password")'}</code> - Login failure</li>
                <li><code>{'toast.success("You were successfully signed out")'}</code> - Logout</li>
                <li><code>{'toast.success("Email sent successfully")'}</code> - Password reset email sent</li>
                <li><code>{'toast.success("Password reset successfully")'}</code> - Password changed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Operations</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li><code>{'toast.success("Patient created successfully")'}</code> - Create operation</li>
                <li><code>{'toast.success("Data updated")'}</code> - Update operation</li>
                <li><code>{'toast.error("Failed to save data")'}</code> - Save failure</li>
                <li><code>{'toast.warning("There are unsaved changes")'}</code> - Unsaved changes warning</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
