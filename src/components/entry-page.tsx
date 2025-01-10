'use client'

import React from "react"
import EntryList from './entry-list'
import EntryAddButton from './entry-add-button'
import EntryStats from '@/components/entry-stats'
import { useDateTabContext } from '@/app/dashboard/(app)/layout'

export default function EntryPage() {
  const tab = useDateTabContext()
  return (
    <div className="flex flex-col py-2 pb-12">
      <EntryStats tab={tab} />
      {tab === 'now' && <EntryAddButton />}
      <EntryList type={tab} />
    </div>
  )
}