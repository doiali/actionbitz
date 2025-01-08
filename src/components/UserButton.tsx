'use client';
import { useSession } from "next-auth/react";
import { Button } from './ui/button';
import Link from 'next/link';

export default function UserButton() {
  const session = useSession();

  const { status } = session;
  return (
    <div className="flex items-center justify-center">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'authenticated' && (
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      )}
      {status === 'unauthenticated' && (
        <Button asChild>
          <Link href="/auth/signin">Login</Link>
        </Button>
      )}
    </div>
  );
}