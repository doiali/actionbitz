'use client'

import { DateSelector } from '@/components/DateSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Entry } from '@prisma/client'

export default function EntryForm({
  state, onChange, onSubmit, onCancel, disabled
}: {
  state: Partial<Entry>
  onChange: <T extends keyof Entry>(name: T, value: Entry[T]) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
  onCancel?: () => void
}) {
  const { title, datetime = new Date() } = state

  return (
    <form className="flex flex-col gap-2 p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring" onSubmit={onSubmit}>
      <Input
        autoFocus
        name="title"
        value={title}
        placeholder="Title"
        required
        onChange={({ target: { value, name } }) => {
          onChange(name as 'title', value)
        }}
        className="text-lg border-none focus-visible:ring-0"
      />
      <div className="flex justify-between items-center gap-2">
        <DateSelector value={datetime} onChange={(d) => onChange('datetime', d)} />
        <div>
          {onCancel &&
            <Button variant="ghost" type="button" disabled={disabled} onClick={onCancel}>
              Cancel
            </Button>
          }
          <Button disabled={disabled || !title}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}