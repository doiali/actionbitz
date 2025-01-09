'use client'

import { useEntryReport } from '@/entities/entry'
import React from 'react'
import { Badge } from './ui/badge'

const EntryReport: React.FC<{ tab?: 'past' | 'now' | 'future' }> = ({ tab = 'now' }) => {
  const { data, isLoading, error } = useEntryReport()

  return (
    <div className="p-4 border rounded-2xl flex gap-2">
      <div className="grow text-center">
        You took care of <br />
        <Badge className="text-md" variant="secondary" >{data?.completed}</Badge>
        out of
        <Badge className="text-md" variant="secondary">{data?.count}</Badge> actions!
      </div>
    </div>
  )
}

export default EntryReport