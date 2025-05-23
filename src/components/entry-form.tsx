'use client'

import { DateSelector } from '@/components/date-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EntryCreate } from '@/entities/entry'
import { FormEvent, useEffect, useRef } from 'react'

export default function EntryForm({
  state, onChange, onSubmit, onCancel, disabled
}: {
  state: EntryCreate
  onChange: <T extends keyof EntryCreate>(name: T, value: EntryCreate[T]) => void
  onSubmit: () => void
  disabled?: boolean
  onCancel?: () => void
}) {
  const { title, date, description } = state
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [])

  return (
    <form className="flex flex-col p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring" onSubmit={handleSubmit}>
      <Input
        autoFocus
        name="title"
        value={title}
        placeholder="Title"
        required
        onChange={({ target: { value, name } }) => {
          onChange(name as 'title', value)
        }}
        className="text-lg border-none py-0 focus-visible:ring-0"
      />
      <Textarea
        ref={ref}
        name="description"
        value={description || ''}
        placeholder="Description"
        onChange={({ target }) => {
          const { value, name } = target
          onChange(name as 'description', value)
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
        }}
        className="text-lg border-none py-0 focus-visible:ring-0 resize-none"
      />
      <div className="flex justify-between items-center gap-2 mt-2">
        <DateSelector value={date} onChange={(d) => onChange('date', d)} />
        <div>
          {onCancel &&
            <Button variant="ghost" type="button" disabled={disabled} onClick={onCancel}>
              Cancel
            </Button>
          }
          <Button type="submit" disabled={disabled}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}