import React from "react"
import EntryList from '../../_EntryList'
import EntryReport from '@/components/entry-report'

export default function PastPage() {

  return (
    <div className="flex flex-col py-4">
      <EntryReport tab="past" />
      <EntryList type="past" />
    </div>
  )
}