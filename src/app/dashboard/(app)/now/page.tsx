import React from "react"
import EntryList from '../../_EntryList'
import EntryAddButton from '../../_EntryAddButton'
import EntryReport from '@/components/entry-report'

export default function NowPage() {

  return (
    <div className="flex flex-col py-4">
      <EntryReport />
      <EntryAddButton />
      <EntryList type="now" />
    </div>
  )
}