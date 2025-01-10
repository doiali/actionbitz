"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useEntryReport } from '@/entities/enrty-report'

const EntryReport: React.FC<{ tab?: 'past' | 'now' | 'future' }> = ({ tab = 'now' }) => {
  const { data } = useEntryReport(tab)
  const { count = 0, completed = 0 } = data || {}
  const r = count ? completed / count : 0
  return (
    <div className="flex items-center gap-2 p-2 mb-2">
      <div className="flex flex-row justify-center pb-0 h-[40px]">
        <EntryChart value={r} />
      </div>
      <span className="text-muted-foreground"> {data?.completed} of {data?.count} actions done</span>
    </div>
  )
}

const chartData = [
  { name: "report", value: 200, fill: "var(--color-report)" },
]

const chartConfig = {
  value: {
    label: "Value",
  },
  report: {
    label: "Report",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

/**
 * EntryChart component renders a radial bar chart using Recharts.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.value=0] - The value to determine the end angle of the chart. Should be between 0 and 1.
 * @returns {JSX.Element} The rendered EntryChart component.
 */
const EntryChart: React.FC<{
  value?: number, label?: string, labelSecondary?: string,
}> = ({ value = 0, label, labelSecondary }) => {
  const endAngle = value * 360 + 90
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[100px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={endAngle}
        innerRadius={15}
        outerRadius={30}

      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[18, 12]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox && label) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-lg font-bold"
                    >
                      {label}
                    </tspan>
                    {labelSecondary && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 14}
                        className="fill-muted-foreground"
                      >
                        {labelSecondary}
                      </tspan>
                    )}
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

export default EntryReport