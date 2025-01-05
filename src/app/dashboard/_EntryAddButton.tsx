'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from "react"
import { EntryCreate, getInitialEntry, useEntryCreate } from '@/entities/entry'
import { PlusIcon } from '@heroicons/react/24/outline'
import EntryForm from './_EntryForm'

export default function EntryAddButton() {
  const [showForm, setShowForm] = useState(false)
  const [state, setState] = useState<EntryCreate>(getInitialEntry())

  const mutation = useEntryCreate({
    onSuccess: () => {
      setState(getInitialEntry())
      setShowForm(false)
    }
  })

  const handleClose = () => {
    setShowForm(false)
    setState(getInitialEntry())
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
        <Button variant="ghost" className="w-full justify-start" onClick={() => setShowForm(true)}>
          <PlusIcon className="h-5 w-5 text-primary" />
          <span className="text-primary">Add Entry</span>
        </Button>
      )}
      {showForm && (
        <EntryForm
          state={state}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={handleClose}
          disabled={mutation.isPending}
        />
      )}
    </div>
  )
}