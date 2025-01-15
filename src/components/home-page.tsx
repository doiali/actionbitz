import React from "react"
import StartButton from '@/components/start-button'
import img_now from '@/../public/static/todo-app-now.png'
import img_past from '@/../public/static/todo-app-past.png'
import img_report from '@/../public/static/todo-app-report.png'
import Image, { StaticImageData } from 'next/image'
import { Check } from 'lucide-react'
import clsx from 'clsx'

export default function Home() {
  return (
    <div className="flex flex-col px-4">
      <section className="flex justify-center items-center text-center min-h-[100vh]">
        <div className="flex flex-col items-center">
          <p className="mb-4 text-3xl sm:text-5xl lg:text-6xl">
            Simple Journaling Todo App
          </p>
          <p className="text-muted-foreground">For busy individuals with <span className="font-bold text-lg">lots of</span> todos!</p>
          <p className="text-muted-foreground mb-4">Those who know <i>plannig to do the thing is not doing the thing!</i></p>
          <StartButton />
        </div>
      </section>
      <section className="bg-background/85">
        <div className="py-12 relative w-full max-w-3xl mx-auto">
          <h1 className="relative text-center text-3xl px-4">How it works?</h1>
        </div>
        <div className="w-full max-w-3xl mx-auto flex flex-col">
          <Item img={img_now} data={data[0]} index={1} />
          <Item img={img_report} data={data[1]} reverse index={2} />
          <Item img={img_past} data={data[2]} index={3} />
        </div>
      </section >
    </div >
  )
}
type Data = { title: string, points: [string, string?, boolean?][] }
const Item: React.FC<{
  img: StaticImageData
  data: Data
  reverse?: boolean
  index?: number
}> = ({ data, img, reverse, index }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <span className="font-bold text-4xl border-4 rounded-full p-4 aspect-square flex justify-center border-foreground">{index}</span>
        <h2 className="font-semibold text-2xl mt-4">{data.title}</h2>
      </div>
      <div className="py-12 items-start flex">
        <Image src={img} alt="app-now" className={clsx("w-[18rem] rounded-xl border h-[30rem] object-contain object-[0_1rem]", reverse && 'order-1 md:order-2')} />
        <div className={clsx("flex flex-col gap-4 px-8 grow", reverse && 'order-2 md:order-1')}>
          {data.points.map(([title, description], i) => (
            <div className="flex gap-4 p-2 px-6 rounded-xl" key={i}>
              <Check className="shrink-0 border-2 bg-primary text-primary-foreground w-10 h-10 p-2 rounded-full" />
              <div className="flex flex-col gap-2">
                <div>
                  {title}
                </div>
                <div className="text-muted-foreground text-sm">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}


const data: Data[] = [
  {
    title: 'Simple and easy to do app',
    points: [
      ['Simplicity', 'Create tasks, do them, check them! Easy and simple, No more than 5 minutes to learn evrything.', true],
      ['No big enterprise app', 'No reminders, no notifications, no complexities.', false],
      ['When you check a task, it won\'t disappear!', 'Let\'s see the actions we take! not just what\'s still left!', true],
      ['Fresh start everyday', 'If you miss a task, it won\'t keep popping up! It\'ll go to your history. Maybe it was going to the moon! We can\'t do it all!', true],
    ]
  },
  {
    title: 'Get cool reports',
    points: [
      ['See your actions in number', 'Motivation comes after taking action.'],
      ['See your persistence', 'Weekly and monthly charts showing how much you missed or done!'],
      ['Move those numbers towards completion', 'Start reading that book that you wanted to do 6 months ago?'],
      ['And cool charts and graphs', 'I love charts, don\'t you? And I\'ll keep some charts for monetization and premium members!'],
      ['AI reports!!!!', 'All apps are getting AI powered, why not this one? It would be cool though'],
    ]
  },
  {
    title: 'Journal and timeline',
    points: [
      ['Keep a history timeline of your todos', 'Those bitz of action you did!. Browse your journal Periodically, See what you missed and maybe you can do now!'],
      ['Did you build some atomic habits?', 'I\'ll add repeating tasks and a habit tracker if that\'s what you like! But this app should remain simple! no more than 5 minutes to learn everything!'],
      ['Are you getting 1% better every day?', 'Learn and find out what you could do better! What was important and what wasn\'t worth it'],
      ['And of course a timeline of future todos', 'The focus is primarily on what you could do today, or tomorrow! But planning for future todos is fully supported!'],
    ]
  },
]