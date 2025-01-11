'use client'

import { cn } from "@/lib/utils"
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa6'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, setIsPending] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  // const code = searchParams.get('code');
  const msg = error === "CredentialsSignin" ? "Invalid credentials!" : error

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              setIsPending(true)
              const data = new FormData(e.currentTarget as HTMLFormElement)
              signIn('resend', {
                email: data.get('email') as string,
              })
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Button type="button" variant="outline" className="w-full"
                  onClick={() => signIn('google')}
                >
                  <FaGoogle /> Continue with Google
                </Button>
                <Button
                  type="button" variant="outline" className="w-full"
                  onClick={() => signIn('github')}
                >
                  <FaGithub /> Continue with GitHub
                </Button>
              </div>
              <p className="text-center">Or</p>
              <div className="flex flex-col gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div>
                  {msg && (
                    <span className='flex gap-2 items-center text-red-500'>
                      <ExclamationCircleIcon className="h-5 w-5" />
                      <p className="text-sm text-red-500">{msg}</p>
                    </span>
                  )}
                </div>
                <Button type="submit" className="w-full" aria-disabled={isPending}>
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
