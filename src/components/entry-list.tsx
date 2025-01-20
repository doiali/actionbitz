'use client'

import { EntryCreate, EntryData, getInitialEntry, useEntryCreate, useEntryList } from '@/entities/entry'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import EntryItem from './entry-item'
import EntryForm from './entry-form'

const noData = {
  past: {
    title: 'No history yet!',
    body: 'You\'ll have a journal of every action bit here!'
  },
  now: {
    title: 'Nothing yet!',
    body: 'What will get done today?'
  },
  future: {
    title: 'No actions planned for future',
    body: 'Wanna plan or postpone something?'
  },
}

export default function EntryList({ type = 'future' }: { type?: 'now' | 'past' | 'future' }) {
  const query = useEntryList(type)
  const {
    isLoading, isError, allData, isSuccess,
    hasNextPage, fetchNextPage, isFetchingNextPage
  } = query


  const groupedEntries = useMemo(() => allData.reduce((acc, entry) => {
    const entryDate = format(entry.date, 'EEEE, MMMM d, yyyy')
    const group = acc.find(x => x.dateLabel === entryDate)
    if (!group) {
      acc.push({
        data: [entry],
        dateLabel: entryDate,
        date: entry.date
      })
    } else {
      group.data.push(entry)
    }
    return acc
  }, [] as { date: Date, data: EntryData[], dateLabel: string }[]), [allData])

  const renderEntries = useCallback(() => {
    const elements: React.ReactNode[] = []
    groupedEntries.forEach(g => {
      elements.push(
        <EntryGroup
          key={g.dateLabel}
          data={g.data}
          dateLabel={g.dateLabel}
          allowAdd={type === 'future'}
          hideDate={type === 'now'}
        />
      )
    })

    return elements
  }, [groupedEntries, type])

  return (
    <ul className="flex flex-col">
      {isLoading && (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <li className="py-2 border-t" key={index} ><Skeleton className="h-8" /></li>
          ))}
        </>
      )}
      {isError && <li className="py-2 text-center text-destructive">Something went wrong!</li>}
      {isSuccess && !allData?.length && (
        <li className="flex flex-col gap-4 text-center py-12">
          <span className="font-bold text-xl">{noData[type].title}</span>
          <span className="text-muted-foreground">{noData[type].body}</span>
        </li>
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

const EntryGroup: React.FC<{
  data: EntryData[], dateLabel: string, allowAdd?: boolean, hideDate?: boolean
}> = ({ data, dateLabel, allowAdd, hideDate }) => {
  const date = new Date(dateLabel)
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
    <>
      {!hideDate && (
        <li key={dateLabel} className="pt-6 ps-4 pb-1 text-sm font-bold text-muted-foreground flex items-center gap-2">
          {<span className="gorw">{dateLabel}</span>}
          {allowAdd && (
            <Button disabled={showForm} variant="ghost" size="icon" className="[&_svg]:size-6" onClick={() => setShowForm(true)}>
              <Plus className="text-primary" />
            </Button>
          )}
        </li>
      )}
      {allowAdd && showForm && (
        <div className="max-md:px-2 pb-2">
          <EntryForm
            state={state}
            onChange={onChange}
            onSubmit={onSubmit}
            onCancel={handleClose}
            disabled={mutation.isPending}
          />
        </div>
      )}
      {data.map(item => (
        <EntryItem key={item.id} entry={item} />
      ))}
    </>
  )
} 