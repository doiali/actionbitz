'use client'

import { Calendar } from '@/components/ui/calendar'
import { startOfToday } from 'date-fns'
import { useState } from 'react'

export default function PastPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex p-4">
      <Calendar
        disabled={(date) => date < startOfToday()}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
    </div>
  )
}