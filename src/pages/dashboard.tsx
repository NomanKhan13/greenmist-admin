"use client"

import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"

import KpiCards from "@/features/dashboard/kpi-cards"
import { RevenueOccupancyChart } from "@/features/dashboard/revenue-occupancy-chart"
import { TodayArrivalsDepartures } from "@/features/dashboard/activity.table"
import { RevenueByRoomChart } from "@/features/dashboard/revenue-by-room"
import { RoomStatusChart } from "@/features/dashboard/room-status"

const todayTasksData = [
  { id: 1, title: "Inspect Penthouse suite", completed: false },
  { id: 2, title: "Check-out inspection Room 112", completed: true },
  { id: 3, title: "Restock minibar floor 3", completed: false },
  { id: 4, title: "Approve housekeeping logs", completed: false },
  { id: 5, title: "Review tomorrow's VIP arrivals", completed: false },
]

export default function HotelDashboard() {
  const [tasks, setTasks] = useState(todayTasksData)

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <div className="flex-1 space-y-8 overflow-y-auto bg-background p-6 text-foreground md:p-8 lg:p-10">
      {/* --- Header & Global Filters --- */}
      <div className="flex flex-col items-start justify-between gap-4 pb-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your property overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="hill-retreat">
            <SelectTrigger className="w-full max-w-48 border-border bg-card shadow-sm">
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

          <Select defaultValue="7-days">
            <SelectTrigger className="w-full max-w-48 border-border bg-card shadow-sm">
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

      {/* --- ROW 1: KPI Cards (100% Width) --- */}
      <KpiCards />

      {/* --- ROW 2: Main Area Chart (100% Width) --- */}
      <RevenueOccupancyChart />

      {/* --- ROW 3: Arrivals & Departures Table (100% Width) --- */}
      <TodayArrivalsDepartures />

      {/* --- ROW 4: Bottom Widgets (3-Column Grid) --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Column 1: Revenue by Room Type */}
        <RevenueByRoomChart />

        {/* Column 2: Live Room Status */}
        <RoomStatusChart />

        {/* Column 3: Today's Tasks */}
        <Card className="flex h-82 flex-col border-border bg-card shadow-sm lg:h-full">
          <CardHeader className="pb-4">
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Daily operational checklist</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-0.5 border-border"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`cursor-pointer text-sm leading-tight font-medium transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      task.completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground group-hover:text-primary"
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
  )
}
