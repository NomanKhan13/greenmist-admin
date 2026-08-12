"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
} from "recharts"
import {
  Calendar,
  CheckCircle2,
  CircleDashed,
  Hotel,
  TrendingUp,
  XCircle,
  Clock,
  MoreHorizontal,
  MapPin,
} from "lucide-react"
import KpiCards from "@/features/dashboard/kpi-cards"
import { RevenueOccupancyChart } from "@/features/dashboard/revenue-occupancy-chart"
import { TodayArrivalsDepartures } from "@/features/dashboard/activity.table"

// --- Shadcn Chart Configuration ---
// Maps the data keys to the correct CSS variables and labels for the tooltips/legends
const chartConfig = {
  revenue: { label: "Revenue ($)", color: "var(--chart-1)" },
  occupancy: { label: "Occupancy (%)", color: "var(--chart-2)" },
  standard: { label: "Standard", color: "var(--chart-1)" },
  deluxe: { label: "Deluxe", color: "var(--chart-2)" },
  suite: { label: "Suite", color: "var(--chart-3)" },
  penthouse: { label: "Penthouse", color: "var(--chart-4)" },
  occupied: { label: "Occupied", color: "var(--chart-1)" },
  vacant: { label: "Vacant", color: "var(--chart-5)" },
  maintenance: { label: "Maintenance", color: "var(--destructive)" },
}

// --- Mock Data ---
// Note: Fill colors in Pie charts reference the CSS variables handled by Shadcn ChartContainer
const revenueOccupancyData = [
  { date: "Jul 20", revenue: 4200, occupancy: 68 },
  { date: "Jul 21", revenue: 5100, occupancy: 75 },
  { date: "Jul 22", revenue: 4800, occupancy: 72 },
  { date: "Jul 23", revenue: 6300, occupancy: 85 },
  { date: "Jul 24", revenue: 7100, occupancy: 92 },
  { date: "Jul 25", revenue: 8400, occupancy: 98 },
  { date: "Jul 26", revenue: 6900, occupancy: 88 },
]

const revenueByRoomData = [
  { type: "standard", revenue: 12500, fill: "var(--color-standard)" },
  { type: "deluxe", revenue: 18400, fill: "var(--color-deluxe)" },
  { type: "suite", revenue: 9800, fill: "var(--color-suite)" },
  { type: "penthouse", revenue: 5200, fill: "var(--color-penthouse)" },
]

const roomStatusData = [
  { status: "occupied", count: 85, fill: "var(--color-occupied)" },
  { status: "vacant", count: 22, fill: "var(--color-vacant)" },
  { status: "maintenance", count: 5, fill: "var(--color-maintenance)" },
]

const arrivalsDeparturesData = [
  {
    id: "RES-101",
    name: "Alice Freeman",
    room: "304",
    type: "Arrival",
    status: "Pending",
    time: "14:00",
  },
  {
    id: "RES-102",
    name: "Marcus Johnson",
    room: "112",
    type: "Departure",
    status: "Checked Out",
    time: "09:30",
  },
  {
    id: "RES-103",
    name: "Sophia Martinez",
    room: "501",
    type: "Arrival",
    status: "Checked In",
    time: "11:15",
  },
  {
    id: "RES-104",
    name: "David Chen",
    room: "220",
    type: "Departure",
    status: "Pending",
    time: "12:00",
  },
  {
    id: "RES-105",
    name: "Emma Wilson",
    room: "418",
    type: "Arrival",
    status: "Pending",
    time: "15:00",
  },
]

const todayTasksData = [
  { id: 1, title: "Inspect Penthouse suite", completed: false },
  { id: 2, title: "Check-out inspection Room 112", completed: true },
  { id: 3, title: "Restock minibar floor 3", completed: false },
  { id: 4, title: "Approve housekeeping logs", completed: false },
  { id: 5, title: "Review tomorrow's VIP arrivals", completed: false },
]

export default function HotelDashboard() {
  const [tasks, setTasks] = useState(todayTasksData)
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto bg-background p-8 pt-6 text-foreground">
      {/* --- Header & Global Filters --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your property overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Global Property Selector */}
          <Select defaultValue="hill-retreat">
            <SelectTrigger className="w-full max-w-48 border-border bg-card">
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Properties</SelectLabel>
                <SelectItem value="hill-retreat">
                  GreenMist Hill Retreat
                </SelectItem>
                <SelectItem value="valley-retreat">
                  GreenMist Valley Retreat
                </SelectItem>
                <SelectItem value="tea-garden">GreenMist Tea Garden</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Global Date Filter */}
          <Select defaultValue="7-days">
            <SelectTrigger className="w-full max-w-48 border-border bg-card">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Timeframe</SelectLabel>
                <SelectItem value="7-days">Last 7 Days</SelectItem>
                <SelectItem value="30-days">Last 30 Days</SelectItem>
                <SelectItem value="90-days">Last 90 Days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Main 2-Column Grid --- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* ================= COLUMN 1 (70-80% Width) ================= */}
        <div className="space-y-6 xl:col-span-4">
          {/* Row 1: 5 Cards Grid */}
          <KpiCards />

          {/* Row 2: Revenue & Occupancy Rate over time (Area + Line Composed for Dual Axis) */}
          <RevenueOccupancyChart />

          {/* Row 3: Today's Arrivals & Departures */}
          <TodayArrivalsDepartures />
        </div>

        {/* ================= COLUMN 2 (20-30% Width) ================= */}
        <div className="space-y-6 xl:col-span-1">
          {/* Row 1: Revenue by Room Type */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Revenue by Room Type</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={revenueByRoomData}
                    dataKey="revenue"
                    nameKey="type"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={3}
                    stroke="var(--background)"
                    paddingAngle={2}
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent className="flex-wrap gap-2 text-xs" />
                    }
                    className="-translate-y-2"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Row 2: Room Status */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Live Room Status</CardTitle>
              <CardDescription>Current snapshot of inventory</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={roomStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={0}
                    outerRadius={80}
                    strokeWidth={3}
                    stroke="var(--background)"
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent className="flex-wrap gap-2 text-xs" />
                    }
                    className="-translate-y-2"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Row 3: Today's Tasks */}
          <Card className="flex h-[325px] flex-col border-border bg-card">
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Daily operational checklist</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 border-border"
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`cursor-pointer text-sm leading-tight font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        task.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Make a React component (Dashboard) using shadcn components and charts
// 1. Property selector and date filter (7 days, 30 days, 90 days) at the top right [use the best suited shadcn components for this]

// Dashboard will have two columns, first column will take 70-80% of the width and second column will take 20-30% of the width
// First column will have 3 rows - 5 cards, Revenue & Occupancy Rate over time (line chart or area chart), Today's Arrivals & Departures (table)
// 2. First column, first row - 5 cards (First card will have name, Date and a property selector and this will be a bit distinct from rest 4 KPI cards. Other 4 are KPI cards (Total Reservations, Total Cancellations, Average Length of Stay, Average Daily Rate)) [use best suited shadcn components for this]
// 3. First column, second row - Revenue & Occupancy Rate over time (line chart or area chart) [use shadcn chart components for this]
// 4. First column, third row - Today's Arrivals & Departures (table) [use shadcn table components for this]
// 5. Second column will have 3 rows - Revenue by Room Type (which room made how much money ) (best suited chart), Room Status (occupied, vacant, maintenance) (best suited chart) [use shadcn chart components for this], Today's tasks (list of tasks for the day) [use best suited shadcn components for this]

/**
 * Plan for the dashboard page:
 * 1. Date filter: 7 days, 30 days & 90 days
 * 2. 5 Cards - First will have name, Date and a property selector. Other 4 are KPI cards (Total Reservations, Total Cancellations, Average Length of Stay, Average Daily Rate)
 * 3. Revenue & Occupancy Rate over time (line chart or area chart)
 * 4. Revenue by Room Type (which room made how much money ) (Bar chart)
 * 5. Room Status (occupied, vacant, maintenance) (pie chart)
 * 6. Reservations Table (only Today)
 * 7. Today's tasks (list of tasks for the day)
 */
