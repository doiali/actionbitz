'use client'

import { TabNav, TabNavLink, TabNavList } from '@/components/ui/tabnav'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {

  const segment = useSelectedLayoutSegment()
  const activeSegment = segment || 'now'

  return (
    <div className="w-full max-w-3xl mx-auto sm:px-2">
      <TabNav className="">
        <TabNavList className="grid w-full grid-cols-3">
          <TabNavLink active={activeSegment === 'past'} asChild>
            <Link href="/dashboard/past">
              Past
            </Link>
          </TabNavLink>
          <TabNavLink active={activeSegment === 'now'} asChild>
            <Link href="/dashboard/now">
              Now
            </Link>
          </TabNavLink>
          <TabNavLink active={activeSegment === 'future'} asChild>
            <Link href="/dashboard/future">
              Future
            </Link>
          </TabNavLink>
        </TabNavList>
      </TabNav>
      <div>
        {children}
      </div>
    </div>
  )
}