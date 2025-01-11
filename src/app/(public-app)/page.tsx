import React from "react"
import AppBrand from '@/components/app-brand'
import { Badge } from '@/components/ui/badge'
import UserButton from '@/components/user-button'

export default function Home() {
  return (
    <div className="flex items-center justify-center mt-28">
      <div className="flex flex-col items-center text-center">
        <span className="flex gap-2 items-center">
          <h1 className="text-[4rem] lg:[6rem] italic"><AppBrand /></h1>
          <Badge className="mt-6 border-primary rounded-full" variant="outline">Beta</Badge>
        </span>
        <p className="mb-4 text-xl">
          You want to get things done? So just do it!
        </p>

        <UserButton />
      </div>
    </div>
  )
}