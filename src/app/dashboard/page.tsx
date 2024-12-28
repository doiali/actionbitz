'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import React from "react";

export default function Dashboard() {
  const { data } = useSession();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hello World!</h1>
        <p>Welcome to Dashboard!</p>
        <p>{data?.user?.email}</p>
        <Button onClick={() => {
          signOut();
        }}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}