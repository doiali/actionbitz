import React from "react"
import EntryList from '../../_EntryList'

export default function FuturePage() {

  return (
    <div className="flex flex-col py-4">
      <EntryList type="future" />
    </div>
  )
}