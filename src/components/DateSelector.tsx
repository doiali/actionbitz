"use client"

import * as React from "react"
import { addDays, format, isToday, isTomorrow, startOfToday } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const getLabel = (value: Date) => {
  if (isToday(value)) return "Today"
  if (isTomorrow(value)) return "Tomorrow"
  return format(value, "PPP")
}

export function DateSelector({ value, onChange }: {
  value: Date
  onChange: (date: Date) => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {getLabel(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <DateItem onClick={() => { onChange(new Date()); setOpen(false) }}>
            Today
          </DateItem>
          <DateItem onClick={() => { onChange(addDays(new Date(), 1)); setOpen(false) }}>
            Tomorrow
          </DateItem>
          <DateItem onClick={() => { onChange(addDays(new Date(), 7)); setOpen(false) }}>
            Next week
          </DateItem>
          <Popover>
            <PopoverTrigger asChild>
              <DateItem>
                Pick a date
              </DateItem>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                required
                disabled={(date) => date < startOfToday()}
                mode="single"
                selected={value}
                onSelect={(d) => onChange(d)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </PopoverContent>
      </Popover>
    </>
  )
}

const DateItem = ({ children, className, ...props }: { children?: React.ReactNode } & React.ComponentProps<"button">) => (
  <button
    className={cn("relative w-full text-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground", className)}
    {...props}
  >
    {children}
  </button>
)
