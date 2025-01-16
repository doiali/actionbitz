'use client'

import { useEntryList } from '@/entities/entry'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import EntryItem from './entry-item'

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

  const renderEntries = useCallback(() => {
    const elements: React.ReactNode[] = []
    let lastDate = ''

    allData.forEach((entry) => {
      const entryDate = format(entry.date, 'MMMM d, yyyy')
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