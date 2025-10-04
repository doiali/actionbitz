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

type WeekyData = {
  day: string, done: number, missed: number
}

const chartConfig = {
  done: {
    label: "Done",
    color: "hsl(var(--chart-3))",
  },
  ignored: {
    label: "Ignored",
    color: "hsl(var(--chart-3) / 0.1)",
  },
  missed: {
    label: "Missed",
    color: "hsl(var(--chart-muted))",
  },
} satisfies ChartConfig

export const EntryWeeklyChart: React.FC<{ data: WeekyData[] }> = ({ data: chartData }) => {
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
          dataKey="ignored"
          stackId="a"
          fill="var(--color-ignored)"
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
