import AppBrand from '@/components/app-brand'
import UserButton from '@/components/user-button';
import React from "react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-[4rem] lg:[6rem] italic"><AppBrand /></h1>
        <p className="mb-2">Comming soon...</p>
        <UserButton />
      </div>
    </div>
  );
}