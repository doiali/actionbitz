"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { EntryReport, useEntryReport } from '@/entities/enrty-report'
import { memo } from 'react'
import { Card } from './ui/card'

const EntryStats: React.FC<{ tab?: 'past' | 'now' | 'future' }> = ({ tab = 'now' }) => {
  const { data } = useEntryReport(tab)
  const { count = 0, completed = 0 } = data || {}
  const r = count ? completed / count : 0
  if (tab === 'now' || tab === 'future')
    return (
      <div className="flex items-center gap-2 p-2">
        <span className="grow"></span>
        <span className="text-muted-foreground">
          <span className="text-lg font-bold text-foreground">{data?.completed}</span> of <span className="text-lg font-bold text-foreground">{data?.count}</span> actions done
        </span>
        <div className="flex flex-row justify-center pb-0 h-[40px]">
          <EntryChart key={tab} value={r} size={16} />
        </div>
      </div>
    )
  if (tab === 'past')
    return (
      <div className="flex justify-center max-sm:px-2">
        <Card className="flex flex-col gap-2 p-4 px-6">
          <h3 className="font-bold text-xl">Action report</h3>
          <EntryPastStats data={data} />
        </Card>
      </div>
    )

  return null
}

export const EntryPastStats: React.FC<{ data?: EntryReport }> = ({ data }) => {
  const { count = 0, completed = 0, days = 0, daysActive = 0, totalDays = 0 } = data || {}
  const r = count ? completed / count : 0
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2 text-muted-foreground text-sm">
        <span>Last <Stat value={totalDays} /> days</span>
        <span>Active <Stat value={daysActive} /> of <Stat value={days} /> days</span>
        <span className="flex gap-2 ">
          <span>Done: <Stat value={completed} /></span>
          <span>Missed: <Stat value={count - completed} /></span>
        </span>
      </div>
      <div className="flex flex-row justify-center pb-0 h-[110px]">
        <EntryChart key="past" value={r} size={45}
          label={`${Math.round(r * 100)}%`}
          labelSecondary={`of ${count}`}
        />
      </div>
    </div>
  )
}

const Stat: React.FC<{ value: number }> = ({ value }) => {
  return <span className="text-lg font-bold text-foreground">{value}</span>
}

const chartConfig = {
  value: {
    label: "Value",
  },
  report: {
    label: "Report",
    color: "hsl(var(--chart-3))",
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
const EntryChart = memo(({ value = 0, label, labelSecondary, size = 30 }: {
  value?: number, label?: string, labelSecondary?: string, size?: number
}) => {
  console.log(value)
  const endAngle = value * 360 + 90
  const chartData = [
    { name: "report", value: endAngle, fill: "var(--color-report)" },
  ]
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={endAngle}
        innerRadius={size}
        outerRadius={size * 1.8}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[size * 1.12, size * 0.88]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} animationDuration={300} />
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
                      y={(viewBox.cy || 0)}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {label}
                    </tspan>
                    {labelSecondary && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 18}
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
})
EntryChart.displayName = "EntryChart"

export default EntryStats