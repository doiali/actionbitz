'use client'

import React, { createContext, useContext } from "react"
import EntryList from './entry-list'
import EntryAddButton from './entry-add-button'
import EntryStats from '@/components/entry-stats'

export const DateTabContext = createContext('now' as 'now' | 'past' | 'future')
const useDateTabContext = () => useContext(DateTabContext)
export const tabs = ['past', 'now', 'future'] as const

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