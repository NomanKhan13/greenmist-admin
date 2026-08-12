"use client"

import { useMemo } from "react"
import { TrendingUp, DollarSign, Users } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// In production, this will likely be passed as a prop: { data: ChartData[] }
const chartData = [
  { date: "Jul 20", revenue: 4200, occupancy: 68 },
  { date: "Jul 21", revenue: 5100, occupancy: 75 },
  { date: "Jul 22", revenue: 4800, occupancy: 72 },
  { date: "Jul 23", revenue: 6300, occupancy: 85 },
  { date: "Jul 24", revenue: 7100, occupancy: 92 },
  { date: "Jul 25", revenue: 8400, occupancy: 98 },
  { date: "Jul 26", revenue: 6900, occupancy: 88 },
]

// Added Lucide icons to the config based on the shadcn standard
const chartConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "var(--chart-1)",
    icon: DollarSign,
  },
  occupancy: {
    label: "Occupancy (%)",
    color: "var(--chart-2)",
    icon: Users,
  },
} satisfies ChartConfig

export function RevenueOccupancyChart() {
  // Memoized derived data ensures smooth frontend performance
  const { totalRevenue, avgOccupancy, peakOccupancy } = useMemo(() => {
    return {
      totalRevenue: chartData.reduce((sum, item) => sum + item.revenue, 0),
      avgOccupancy: Math.round(
        chartData.reduce((sum, item) => sum + item.occupancy, 0) /
          chartData.length
      ),
      peakOccupancy: Math.max(...chartData.map((item) => item.occupancy)),
    }
  }, []) // Dependency array ready for dynamic props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Occupancy</CardTitle>
        <CardDescription>
          Property performance over the last 7 days
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Fixed h-62.5 typo and added aspect-auto for better responsive scaling */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.0}
                />
              </linearGradient>
              <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-occupancy)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-occupancy)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-xs font-medium text-muted-foreground"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />

            {/* Essential for accurate scaling without flattening the lines */}
            <YAxis yAxisId="left" hide domain={["auto", "auto"]} />
            <YAxis yAxisId="right" orientation="right" hide domain={[0, 100]} />

            <ChartTooltip
              cursor={{
                stroke: "var(--muted-foreground)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              yAxisId="left"
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              yAxisId="right"
              dataKey="occupancy"
              type="monotone"
              fill="url(#fillOccupancy)"
              stroke="var(--color-occupancy)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 border-t border-border/50 bg-muted/10 px-6 py-4 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Peak occupancy reached {peakOccupancy}% this week{" "}
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total Revenue: ${totalRevenue.toLocaleString()} • Avg Occupancy:{" "}
          {avgOccupancy}%
        </div>
      </CardFooter>
    </Card>
  )
}
