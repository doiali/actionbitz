'use client'

import React from "react"
import EntryList from './_EntryList'
import EntryAddButton from './_EntryAddButton'
import EntryReport from '@/components/entry-report'
import { useDateTabContext } from './(app)/layout'

export default function EntryPage() {
  const tab = useDateTabContext()
  return (
    <div className="flex flex-col py-2">
      <EntryReport tab={tab} />
      {tab === 'now' && <EntryAddButton />}
      <EntryList type={tab} />
    </div>
  )
}