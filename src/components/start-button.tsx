'use client'
import { useSession } from "next-auth/react"
import { Button } from './ui/button'
import Link from 'next/link'

const StartButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
  const session = useSession()

  const { status } = session
  return (
    <>
      {(status === 'authenticated' || status === 'loading') && (
        <Button asChild {...props}>
          <Link href="/dashboard">Get started</Link>
        </Button>
      )}
      {status === 'unauthenticated' && (
        <Button asChild {...props}>
          <Link href="/auth/signin">Get started</Link>
        </Button>
      )}
    </>
  )
}
export default StartButton