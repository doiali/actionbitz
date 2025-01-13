'use client'

import { useEntryDailyReport, useEntryReport } from '@/entities/enrty-report'
import { EntryPastStats } from './entry-stats'
import { Card, CardTitle } from './ui/card'
import { Crown, Sparkles, Wrench } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button'
import { EntryWeeklyChart } from './report-weekly'

export default function EntryReportPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 pb-12">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
        <OverviewReport />
        <WeeklyReport />
        <ReportWidget pro title='Calendar'><ComingSoon /></ReportWidget>
        <ReportWidget pro title='Label break down'><ComingSoon /></ReportWidget>
      </div>
      <div className="grid grid-cols-1 mt-6 md:mt-4">
        <ReportWidget pro
          title={<>AI report <Sparkles className="h-4 w-4 text-primary" /></>}
        >
          <p className="pt-8 text-center text-sm mb-2">
            Create a journals of your actions with AI <br />
            Ask AI about things you did and plan to do!
          </p>
          <p className="flex items-center gap-2 text-muted-foreground pb-8">
            <Wrench className="" /> Coming soon ...
          </p>
        </ReportWidget>
      </div>
    </div>
  )
}

const OverviewReport: React.FC = () => {
  const { data } = useEntryReport('past')
  return (
    <Card>
      <div className="flex justify-between items-center p-6 border-b h-16">
        <CardTitle className="flex p-0 ">
          <h2 className="">
            Overview
          </h2>
        </CardTitle>
        <Button variant="outline">All time</Button>
      </div>
      <div className="p-6 py-4 flex flex-col">
        <EntryPastStats data={data} />
      </div>
    </Card>
  )
}

const WeeklyReport: React.FC = () => {
  const { data } = useEntryDailyReport()
  return (
    <Card>
      <div className="flex justify-between items-center p-6 border-b h-16">
        <CardTitle className="flex p-0 ">
          <h2 className="">
            Weekly breakdown
          </h2>
        </CardTitle>
      </div>
      <div className="p-6 py-4 flex flex-col">
        <EntryWeeklyChart />
      </div>
    </Card>
  )
}


const ReportWidget: React.FC<{
  children?: React.ReactNode, title?: React.ReactNode, pro?: boolean
}> = ({ children, title = 'Some cool stats', pro }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center px-6 border-b h-16">
        <CardTitle className="flex justify-between items-center w-full">
          <h2 className="flex items-center gap-2">
            {title}
          </h2>
          {pro && <ProIcon />}
        </CardTitle>
      </div>
      <div className="p-6 py-4 grow flex flex-col items-center justify-center">
        {children}
      </div>
    </Card >
  )
}

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center h-16">
      <p className="flex items-center gap-2 text-muted-foreground">
        <Wrench className="" /> Coming soon ...
      </p>
    </div>
  )
}

const ProIcon = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <span className="text-primary">
            <Crown className="h-6 w-6" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="">
          <p>Premium</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


