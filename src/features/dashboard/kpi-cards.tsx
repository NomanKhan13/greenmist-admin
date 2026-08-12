"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, Building2, Clock, DollarSign, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function KpiCards() {
  const HotelKpis = [
    {
      title: "Total Reservations",
      subtitle: "152",
      cardIcon: BadgeCheck,
      badgeColor: "text-chart-1/75",
      statusValue: "+14.2%",
    },
    {
      title: "Total Cancellations",
      subtitle: "12",
      cardIcon: XCircle,
      badgeColor: "text-destructive",
      statusValue: "-2.1%",
    },
    {
      title: "Average Length of Stay",
      subtitle: "3.2 Days",
      cardIcon: Clock,
      badgeColor: "text-chart-1/75",
      statusValue: "+12.5%",
    },
    {
      title: "Average Daily Rate",
      subtitle: "$145.00",
      cardIcon: DollarSign, // Fixed: Matched the icon to the currency unit
      badgeColor: "text-chart-1/75",
      statusValue: "+8.6%",
    },
  ]

  // Get dynamic day and date for the primary card
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "short" })
  const currentDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div>
      <Card className="overflow-hidden border-border bg-border p-0 shadow-xs">
        {/* md:grid-cols-2 alongside the primary card's col-span-2 ensures no empty cells break the border logic */}
        <CardContent className="grid grid-cols-1 gap-[1px] p-0 md:grid-cols-2 lg:grid-cols-5">
          {/* --- 1. PRIMARY IDENTITY CARD --- */}
          <div className="h-full w-full bg-card bg-linear-to-br from-primary/25 via-transparent to-transparent transition-colors md:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between p-5">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  GreenMist Main
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {currentDay}
                  </p>
                  <span className="text-xs font-medium text-chart-1/75">
                    {currentDate}
                  </span>
                </div>
              </div>
              <Building2 size={18} className="mt-0.5 text-chart-1/75" />
            </div>
          </div>

          {/* --- 2-5. STANDARD KPI CARDS --- */}
          {HotelKpis.map((item, index) => {
            return (
              <div className="h-full w-full bg-card" key={index}>
                <div className="flex items-start justify-between p-5">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold tracking-tight text-foreground">
                        {item.subtitle}
                      </p>
                      <span
                        className={cn("text-xs font-medium", item.badgeColor)}
                      >
                        {item.statusValue}
                      </span>
                    </div>
                  </div>
                  <item.cardIcon
                    size={18}
                    className="mt-0.5 text-muted-foreground/50"
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
{
  /* 1. Distinct Identity Card - UNCHANGED */
}
// <Card className="border-transparent bg-primary text-primary-foreground shadow-md lg:col-span-1">
//   <CardHeader className="pb-2">
//     <CardTitle className="text-lg">Test User</CardTitle>
//     <CardDescription className="text-xs text-primary-foreground/80">
//       {currentDate}
//     </CardDescription>
//   </CardHeader>
//   <CardContent className="mt-2">
//     <Select defaultValue="greenmist-main">
//       <SelectTrigger className="h-8 w-full border-primary-foreground/20 bg-primary-foreground/10 text-xs text-primary-foreground focus:ring-primary-foreground/30">
//         <SelectValue placeholder="Context" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="greenmist-main">
//           GreenMist Main
//         </SelectItem>
//         <SelectItem value="greenmist-beach">Beachfront</SelectItem>
//       </SelectContent>
//     </Select>
//   </CardContent>
// </Card>
