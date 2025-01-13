"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Monday", done: 186, missed: 80 },
  { day: "Tuesday", done: 305, missed: 200 },
  { day: "Wednesday", done: 237, missed: 120 },
  { day: "Thursday", done: 73, missed: 190 },
  { day: "Friday", done: 209, missed: 130 },
  { day: "Saturday", done: 214, missed: 140 },
]

const chartConfig = {
  done: {
    label: "Done",
    color: "hsl(var(--chart-3))",
  },
  missed: {
    label: "Missed",
    color: "hsl(var(--chart-muted))",
  },
} satisfies ChartConfig

export function EntryWeeklyChart() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="done"
          stackId="a"
          fill="var(--color-done)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="missed"
          stackId="a"
          fill="var(--color-missed)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
