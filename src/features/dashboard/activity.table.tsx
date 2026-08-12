"use client"

import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  CircleDashed,
  LogOut,
  LogIn,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Enhanced mock data to support the new rich UI
const arrivalsDeparturesData = [
  {
    id: "GM-5P2X",
    name: "John Doe",
    room: "Suite",
    location: "Hill Retreat", // Optional contextual data
    nights: 5,
    type: "Arrival",
    status: "Pending",
    time: "14:00",
  },
  {
    id: "GM-LVMEM3",
    name: "Marcus Johnson",
    room: "Standard",
    nights: 2,
    type: "Departure",
    status: "Pending",
    time: "09:30",
  },
  {
    id: "GM-Q074TP",
    name: "Sophia Martinez",
    room: "Villa",
    nights: 7,
    type: "Arrival",
    status: "Checked In",
    time: "11:15",
  },
  {
    id: "GM-NDJA6W",
    name: "David Chen",
    room: "Standard",
    nights: 1,
    type: "Departure",
    status: "Checked Out",
    time: "12:00",
  },
  {
    id: "GM-NECJG7",
    name: "Noman Khan",
    room: "Suite",
    nights: 3,
    type: "Arrival",
    status: "Pending",
    time: "15:00",
  },
]

export function TodayArrivalsDepartures() {
  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle>Today's Arrivals & Departures</CardTitle>
        <CardDescription>
          Actionable guest manifest for the current shift
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="h-10 text-muted-foreground">
                Guest & Ref
              </TableHead>
              <TableHead className="h-10 text-muted-foreground">
                Schedule
              </TableHead>
              <TableHead className="h-10 text-muted-foreground">Room</TableHead>
              <TableHead className="h-10 text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="h-10 text-right text-muted-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {arrivalsDeparturesData.map((row) => (
              <TableRow
                key={row.id}
                className="group border-border/50 hover:bg-muted/10"
              >
                {/* 1. Guest Name & Booking Ref Stacked */}
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {row.name}
                    </span>
                    <span className="mt-0.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      {row.id}
                    </span>
                  </div>
                </TableCell>

                {/* 2. Type Badge & Time */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    {row.type === "Arrival" ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 rounded-md border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-500 transition-colors hover:bg-emerald-500/20"
                      >
                        <ArrowDownLeft className="h-3 w-3" />
                        Arrival
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="gap-1 rounded-md border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/20"
                      >
                        <ArrowUpRight className="h-3 w-3" />
                        Depart
                      </Badge>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">
                      {row.time}
                    </span>
                  </div>
                </TableCell>

                {/* 3. Room & Nights Stacked */}
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {row.room}
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      {row.nights} {row.nights === 1 ? "Night" : "Nights"}
                    </span>
                  </div>
                </TableCell>

                {/* 4. Status Indicator (Matches Reservations Page style) */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
                    {row.status === "Pending" && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-amber-500">Unconfirmed</span>
                      </>
                    )}
                    {row.status === "Checked In" && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-emerald-500">In House</span>
                      </>
                    )}
                    {row.status === "Checked Out" && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        <span className="text-muted-foreground">
                          Checked Out
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>

                {/* 5. Primary Quick Action + Secondary Dropdown Menu */}
                <TableCell className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Contextual Quick Action Button */}
                    {row.status === "Pending" && row.type === "Arrival" && (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 w-26 text-xs font-medium shadow-none"
                      >
                        <LogIn className="mr-1 h-3.5 w-3.5" />
                        Check In
                      </Button>
                    )}
                    {row.status === "Pending" && row.type === "Departure" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-26 bg-muted text-xs font-medium text-foreground hover:bg-muted/80"
                      >
                        <LogOut className="mr-1 h-3.5 w-3.5" />
                        Check Out
                      </Button>
                    )}

                    {/* Standard Action Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 border-border bg-popover"
                      >
                        <DropdownMenuItem className="text-xs">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          Edit Reservation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-xs text-destructive focus:text-destructive">
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
