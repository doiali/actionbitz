'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from "react"
import { EntryCreate, getInitialEntry, useEntryCreate } from '@/entities/entry'
import EntryForm from './entry-form'
import { Plus } from 'lucide-react'

export default function EntryAddButton({ date }: { date?: Date }) {
  const [showForm, setShowForm] = useState(false)
  const [state, setState] = useState<EntryCreate>(() => getInitialEntry(date))

  const mutation = useEntryCreate({
    onSuccess: () => {
      setState(getInitialEntry(date))
      setShowForm(false)
    }
  })

  const handleClose = () => {
    setShowForm(false)
    setState(getInitialEntry(date))
  }

  const onChange = <T extends keyof EntryCreate>(name: T, value: EntryCreate[T]) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = () => mutation.mutate(state)

  return (
    <div className="pb-2 border-b">
      {!showForm && (
        <Button variant="ghost" size="lg" className="w-full justify-start [&_svg]:size-6" onClick={() => setShowForm(true)}>
          <Plus className="text-primary -ms-4" />
          <span className="text-primary ms-2">Add Action</span>
        </Button>
      )}
      {showForm && (
        <div className="max-md:px-2">
          <EntryForm
            state={state}
            onChange={onChange}
            onSubmit={onSubmit}
            onCancel={handleClose}
            disabled={mutation.isPending}
          />
        </div>
      )}
    </div>
  )
}