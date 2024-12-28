'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPageController({ children }: { children: React.ReactNode; }) {
  const { status } = useSession();
  const { replace } = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      replace("/dashboard");
    }
  }, [status, replace]);
  if (status === "loading") return 'loading...';
  if (status === "authenticated") return 'redirecting...';
  return children;
}