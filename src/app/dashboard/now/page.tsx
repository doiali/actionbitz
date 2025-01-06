import React from "react"
import EntryList from '../_EntryList'
import EntryAddButton from '../_EntryAddButton'

export default function NowPage() {

  return (
    <div className="flex flex-col py-4">
      <EntryAddButton />
      <EntryList type="now" />
    </div>
  )
}