import UserButton from '@/components/UserButton';
import React from "react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Hello World!</h1>
        <UserButton />
      </div>
    </div>
  );
}