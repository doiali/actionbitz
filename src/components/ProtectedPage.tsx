'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage({ children }: { children: React.ReactNode; }) {
  const { status } = useSession();
  const { replace } = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      replace("/auth/signin");
    }
  }, [status, replace]);
  if (status === "loading") return 'loading...';
  if (status === "unauthenticated") return 'unauthenticated';
  return children;
}