'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from "react"
import { Entry } from '@prisma/client'
import { useEntryCreate } from '@/entities/entry'
import { PlusIcon } from '@heroicons/react/24/outline'
import EntryForm from './_EntryForm'

export default function EntryAddButton() {
  const [showForm, setShowForm] = useState(false)
  const [state, setState] = useState<Partial<Entry>>({
    title: '',
    datetime: new Date(),
    description: '',
  })

  const mutation = useEntryCreate({
    onSuccess: () => {
      setState({ title: '', datetime: new Date(), description: '', })
      setShowForm(false)
    }
  })

  const onChange = <T extends keyof Entry>(name: T, value: Entry[T]) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = () => {
    mutation.mutate({
      title: state.title,
      datetime: state.datetime,
      description: state.description,
      type: 'TODO',
    })
  }
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
          disabled={mutation.isPending}
          onCancel={() => {
            setShowForm(false)
            setState({ title: '', datetime: new Date(), description: '' })
          }}
        />
      )}
    </div>
  )
}