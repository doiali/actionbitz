'use client'
import { useSession } from "next-auth/react"
import { Button } from './ui/button'
import Link from 'next/link'

export default function StartButton() {
  const session = useSession()

  const { status } = session
  return (
    <div className="flex items-center justify-center">
      {(status === 'authenticated' || status === 'loading') && (
        <Button asChild>
          <Link href="/dashboard">Get started</Link>
        </Button>
      )}
      {status === 'unauthenticated' && (
        <Button asChild>
          <Link href="/auth/signin">Get started</Link>
        </Button>
      )}
    </div>
  )
}