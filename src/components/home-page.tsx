import React from "react"
import StartButton from '@/components/start-button'
import img_now from '@/../public/static/todo-app-now.png'
import img_past from '@/../public/static/todo-app-past.png'
import img_report from '@/../public/static/todo-app-report.png'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col px-4">
      <section className="flex justify-center items-center text-center min-h-[100vh]">
        <div className="flex flex-col items-center">
          <p className="mb-4 text-3xl sm:text-5xl lg:text-6xl">
            Simple Journaling Todo App
          </p>
          <p className="text-muted-foreground mb-4">For busy individuals who focus on getting things done!</p>
          <StartButton />
        </div>
      </section>
      <section className="bg-background/85">
        <div className="py-12 relative w-full max-w-3xl mx-auto">
          <h1 className="relative text-center text-3xl px-4">How it works?</h1>
        </div>
        <div className="w-full max-w-3xl mx-auto flex flex-col">
          <div className="py-12 justify-between items-start flex">
            <Image src={img_now} alt="app-now" className="w-64 border rounded-xl" />
            <div></div>
          </div>
          <div className="py-12 justify-between items-start flex">
            <Image src={img_report} alt="app-now" className="order-1 md:order-2 w-64 border rounded-xl" />
            <div className="order-2 md:order-1"></div>
          </div>
          <div className="py-12 justify-between items-start flex">
            <Image src={img_past} alt="app-now" className="w-64 border rounded-xl" />
            <div></div>
          </div>
        </div>
      </section>
    </div>
  )
}