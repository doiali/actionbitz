'use client'

import { EntryCreate, EntryData, useEntryDelete, useEntryList, useEntryUpdate } from '@/entities/entry'
import EntryForm from './_EntryForm'
import { useCallback, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { CheckboxTodo } from '@/components/ui/checkbox-todo'
import { Skeleton } from '@/components/ui/skeleton'

export default function EntryList({ type = 'future' }: { type?: 'now' | 'past' | 'future' }) {
  const query = useEntryList(type)
  const {
    isLoading, isError, allData, isSuccess,
    hasNextPage, fetchNextPage, isFetchingNextPage
  } = query

  const renderEntries = useCallback(() => {
    const elements: React.ReactNode[] = []
    let lastDate = ''

    allData.forEach((entry) => {
      const entryDate = format(entry.datetime, 'MMMM d, yyyy')
      if (entryDate !== lastDate && type !== 'now') {
        elements.push(
          <li key={entryDate} className="pt-6 ps-4 pb-1 text-sm font-bold text-muted-foreground">
            {entryDate}
          </li>
        )
        lastDate = entryDate
      }
      elements.push(<EntryItem key={entry.id} entry={entry} />)
    })

    return elements
  }, [allData, type])

  return (
    <ul className="flex flex-col">
      {isLoading && (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <li className="py-2 border-t" key={index} ><Skeleton className="h-8" /></li>
          ))}
        </>
      )}
      {isError && <li className="text-center">Error!</li>}
      {isSuccess && !allData?.length && (
        <li className="text-center">No Data</li>
      )}
      {renderEntries()}
      <li className="flex justify-center mt-2">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          variant="ghost"
          className={hasNextPage ? undefined : 'invisible'}
        >
          Load more <ChevronDown className="w-5 h-5" />
        </Button>
      </li>
    </ul>
  )
}



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
            })}
            disabled={mutation.isPending}
          />
          <button
            className="hover:cursor-pointer grow text-start flex flex-col gap-1"
            onClick={() => setEdit(true)}
          >
            <span>{entry.title}</span>
            <span className="line-clamp-1 whitespace-pre-line text-sm text-muted-foreground">{entry.description}</span>
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

const EntryMenu = ({ entry }: { entry: EntryData }) => {
  const mutation = useEntryDelete()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => mutation.mutate(Number(entry.id))}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    mutation.mutate(state)
  }

  return (
    <EntryForm
      state={state}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onClose}
      disabled={mutation.isPending}
    />
  )
}