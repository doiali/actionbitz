'use client';

import { cn } from "@/lib/utils";
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  // const code = searchParams.get('code');
  const msg = error === "CredentialsSignin" ? "Invalid credentials!" : error;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              setIsPending(true);
              const data = new FormData(e.currentTarget as HTMLFormElement);
              signIn('credentials', {
                email: data.get('email') as string,
                password: data.get('password') as string
              });
            }}
          >
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input name="password" id="password" type="password" required />
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
              <Button type="button" variant="outline" className="w-full"
                onClick={() => signIn('google')}
              >
                Login with Google
              </Button>
              <Button
                type="button" variant="outline" className="w-full"
                onClick={() => signIn('github')}
              >
                Login with GitHub
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
