"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const users = [
  { uuid: "550e8400-e29b-41d4-a716-446655440001", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { uuid: "550e8400-e29b-41d4-a716-446655440002", name: "Bob Smith", email: "bob@example.com", role: "User" },
  { uuid: "550e8400-e29b-41d4-a716-446655440003", name: "Carol White", email: "carol@example.com", role: "Editor" },
  { uuid: "550e8400-e29b-41d4-a716-446655440004", name: "David Brown", email: "david@example.com", role: "User" },
]

export default function TableShowcase() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Table</h1>
        <p className="text-muted-foreground">
          A responsive table component for displaying tabular data.
        </p>
      </div>

      {/* Basic Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Table</h2>
        <Card className="p-6">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      </section>

      {/* Table with Status Badges */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Table with Status Badges</h2>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.paymentStatus === "Paid"
                          ? "success"
                          : invoice.paymentStatus === "Pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {invoice.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Compact Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Compact Table</h2>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uuid}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Striped Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Striped Table</h2>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.uuid}
                  className={index % 2 === 0 ? "bg-muted/50" : ""}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Hoverable Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hoverable Table</h2>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 5).map((invoice) => (
                <TableRow
                  key={invoice.invoice}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Usage Documentation */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Import</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Example</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`<Table>
  <TableCaption>A list of items.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Components</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <code className="bg-muted px-2 py-1 rounded">Table</code> - Main
                container with overflow handling
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableHeader</code> -
                Header section
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableBody</code> - Body
                section
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableFooter</code> -
                Footer section
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableRow</code> - Row
                element
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableHead</code> -
                Header cell
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableCell</code> - Body
                cell
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">TableCaption</code> -
                Optional caption
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Styling Options</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Add striped rows with conditional background classes</li>
              <li>• Make rows hoverable with hover:bg-muted/50</li>
              <li>• Use text-right for right-aligned content (numbers, amounts)</li>
              <li>• Set fixed column widths with w-[100px] utilities</li>
              <li>• Add borders with border utilities</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use TableCaption for screen readers</li>
              <li>• Ensure proper heading hierarchy</li>
              <li>• Include scope attributes when needed</li>
              <li>• Maintain sufficient color contrast</li>
              <li>• Support keyboard navigation for interactive rows</li>
            </ul>
          </div>
        </Card>
      </section>
    </div>
  )
}
