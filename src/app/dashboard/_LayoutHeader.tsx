'use client'

import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { TabNavLink, TabNavList, TabNav } from '@/components/ui/tabnav'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function LayoutHeader() {
  const { data } = useSession()

  return (
    <>
      <div className="flex gap-2 py-4 border-b items-center">
        <span>
          Dashboard
        </span>
        <span className="grow" />
        <span>{data?.user?.name || data?.user?.email}</span>
        <Button variant="secondary" onClick={() => {
          signOut()
        }}>
          Sign Out
        </Button>
        <ThemeToggle />
      </div>
      <LayoutNavTabs />
    </>
  )
};

export function LayoutNavTabs() {
  const segment = useSelectedLayoutSegment()
  const activeSegment = segment || 'now'
  return (
    <TabNav>
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
  )
}