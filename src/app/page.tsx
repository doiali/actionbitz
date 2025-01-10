import UserButton from '@/components/user-button';
import React from "react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Action<span className="text-primary">Bitz</span></h1>
        <p className="mb-2">Comming soon...</p>
        <UserButton />
      </div>
    </div>
  );
}