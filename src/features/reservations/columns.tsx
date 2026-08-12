import { differenceInDays, format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { ReservationProp } from "@/pages/reservations"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<ReservationProp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5" // Minor optical alignment tweak
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "guest",
    accessorFn: (row) => `${row.fullName} ${row.booking_code}`,
    header: "Guest & Booking Ref",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-1">
          <span className="max-w-40 truncate font-medium text-foreground">
            {row.original.fullName || "John Doe"}
          </span>
          <span className="font-mono text-xs text-muted-foreground/70">
            {row.original.booking_code || "GM-SP"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    id: "category",
    filterFn: "equalsString",

    header: "Room & Location",

    cell: ({ row }) => {
      const category = row.original.category as string
      // Assuming you added propertyName to your ReservationProp type
      const rawProperty = row.original.propertyName || ""

      // UX Tweak: Strip out "GreenMist " to save horizontal space
      const shortProperty = rawProperty.replace("GreenMist ", "")

      return (
        <div className="flex flex-col items-start space-y-0.5">
          <span className="text-sm font-medium text-foreground/90">
            {category}
          </span>
          {/* Use truncate and a max-width to ensure long names never break your table layout */}
          <span className="max-w-32.5 truncate font-mono text-xs text-muted-foreground/70 uppercase">
            {shortProperty}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "propertyName",
    id: "property",
  },
  // {
  //   id: "duration",
  //   accessorFn: (row) => {
  //     const checkIn = new Date(row.check_in)
  //     const checkOut = new Date(row.check_out)
  //     return differenceInDays(checkOut, checkIn)
  //   },
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         // Removed standard padding to align perfectly with the text below it
  //         className="-ml-4 h-8 hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Duration
  //         <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const duration = row.getValue("duration")
  //     return (
  //       <span className="text-sm text-foreground">{duration as number}</span>
  //     )
  //   },
  // },

  {
    accessorKey: "check_in",
    id: "check_in",
  },

  {
    accessorKey: "createdAt",
    id: "createdAt",
  },

  {
    accessorKey: "check_out",
    id: "check_out",
  },
  {
    id: "dates",
    header: "Check-In & Check-Out",
    cell: ({ row }) => {
      const checkIn = format(row.original.check_in, "MMM d")
      const checkOut = format(row.original.check_out, "MMM d")
      const duration = differenceInDays(checkOut, checkIn)

      return (
        <div className="flex flex-col items-start space-y-0.5">
          <span className="text-sm font-medium text-foreground/90">
            {checkIn} - {checkOut}
          </span>
          <span className="font-mono text-xs text-muted-foreground/70 uppercase">
            {duration} {duration > 1 ? "nights" : "night"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    filterFn: "equalsString",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase()

      const getStatusStyles = () => {
        switch (status) {
          case "in-house":
            return { text: "text-primary", dot: "bg-primary" } // Deep green
          case "completed":
            return { text: "text-zinc-500", dot: "bg-zinc-500" } // Muted gray
          case "unconfirmed":
            return { text: "text-amber-500", dot: "bg-amber-500" } // Matte gold
          case "confirmed":
            return { text: "text-blue-500", dot: "bg-blue-500" } // Crisp blue for secured upcoming
          case "no-show":
            return { text: "text-orange-500", dot: "bg-orange-500" } // Warning orange
          case "cancelled":
            return { text: "text-destructive", dot: "bg-destructive" } // Soft red
          default:
            return { text: "text-muted-foreground", dot: "bg-muted" }
        }
      }

      const styles = getStatusStyles()

      return (
        <div className="flex items-center gap-2">
          {/* Minimalist Status Dot */}
          <div className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
          {/* Elevated Typography matching the Payment status */}
          <span
            className={cn(
              "text-[10px] font-semibold tracking-wider uppercase",
              styles.text
            )}
          >
            {status}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalPriceAtBooking",
    header: "Payment",
    cell: ({ row }) => {
      const isPaid = row.original.isPaid as boolean
      // NOTE: Replace row.original.totalPrice with your actual DB column name
      const amount = Number(row.getValue("totalPriceAtBooking")) || 0

      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount)

      return (
        <div className="flex flex-col items-start space-y-0.5">
          {/* tabular-nums ensures the numbers align perfectly if you ever right-align this column */}
          <span className="text-sm font-medium tracking-tight text-foreground/90 tabular-nums">
            {formattedAmount}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] font-semibold tracking-wider uppercase",
              isPaid ? "text-primary" : "text-destructive/80"
            )}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-xl">
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Check in</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
