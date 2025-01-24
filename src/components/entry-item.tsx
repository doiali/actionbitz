'use client'

import { EntryCreate, EntryData, useEntryDelete, useEntryUpdate, useEntryCreate } from '@/entities/entry'
import EntryForm from './entry-form'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { CheckboxTodo } from '@/components/ui/checkbox-todo'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { startOfToday } from 'date-fns'

const EntryItem = ({ entry }: {
  entry: EntryData
}) => {
  const [edit, setEdit] = useState(false)
  const mutation = useEntryUpdate()

  return (
    <li key={entry.id} className="py-2 border-t">
      {!edit && (
        <div key={entry.id} className="flex items-center px-4">
          <CheckboxTodo
            className="me-4 w-6 h-6 rounded-full"
            checked={entry.completed}
            onClick={() => mutation.mutate({
              ...entry,
              completed: !entry.completed,
              prev: entry,
            })}
            disabled={mutation.isPending}
          />
          <button
            className="hover:cursor-pointer grow text-start flex flex-col gap-1"
            onClick={() => setEdit(true)}
          >
            <span className="line-clamp-1">{entry.title}</span>
            <span className="line-clamp-1 text-sm text-muted-foreground">{entry.description}</span>
          </button>
          <span><EntryMenu entry={entry} /></span>
        </div>
      )}
      {edit && (
        <EntryEditForm
          entry={entry}
          onClose={() => setEdit(false)}
        />
      )}
    </li>
  )
}

export default EntryItem

const EntryMenu = ({ entry }: { entry: EntryData }) => {
  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const deleteMutation = useEntryDelete()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => deleteMutation.mutate(entry)}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCopyDialogOpen(true)}>
          Copy
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent>
          <DialogTitle>Copy Action</DialogTitle>
          <DialogDescription asChild>
            <div>
              <EntryCopyForm entry={entry} onClose={() => setCopyDialogOpen(false)} />
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  )
}

const getInitialCopyEntry: (entry: EntryData) => EntryCreate = (entry) => ({
  title: entry.title,
  type: 'TODO',
  description: entry.description,
  completed: false,
  datetime: null,
  date: startOfToday(),
})

const EntryCopyForm = ({ entry, onClose }: {
  entry: EntryData
  onClose: () => void
}) => {
  const [state, setState] = useState<EntryCreate>(getInitialCopyEntry(entry))

  const mutation = useEntryCreate({
    onSuccess: () => handleClose()
  })

  const onChange = <T extends keyof EntryCreate>(name: T, value: EntryCreate[T]) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClose = () => {
    onClose()
    setState(getInitialCopyEntry(entry))
  }

  const onSubmit = () => {
    mutation.mutate(state)
  }

  return (
    <EntryForm
      state={state}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={handleClose}
      disabled={mutation.isPending}
    />
  )
}

const EntryEditForm = ({ entry, onClose }: {
  entry: EntryData
  onClose: () => void
}) => {
  const [state, setState] = useState<EntryData>({ ...entry })

  const mutation = useEntryUpdate({
    onSuccess: (data) => {
      setState({ ...data })
      onClose?.()
    }
  })

  const onChange = <T extends keyof EntryCreate>(name: T, value: EntryCreate[T]) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = () => {
    mutation.mutate({ ...state, prev: entry })
  }

  return (
    <div className="max-md:px-2">
      <EntryForm
        state={state}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onClose}
        disabled={mutation.isPending}
      />
    </div>
  )
}