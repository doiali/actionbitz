import React from "react"
import EntryList from '../../_EntryList'

export default function PastPage() {

  return (
    <div className="flex flex-col py-4">
      <EntryList type="past" />
    </div>
  )
}