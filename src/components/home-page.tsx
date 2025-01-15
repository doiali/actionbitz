import React from "react"
import StartButton from '@/components/start-button'
import img_now from '@/../public/static/todo-app-now.png'
import img_past from '@/../public/static/todo-app-past.png'
import img_report from '@/../public/static/todo-app-report.png'
import Image, { StaticImageData } from 'next/image'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import Story from './home-page-story.mdx'


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
      <section className="flex flex-col items-center py-12">
        <h2 className="font-bold text-2xl mb-4">My story</h2>
        <h3 className="font-bold text-lg mb-4">Why Did I Build a Todo App in 2025?</h3>
        <div className="prose dark:prose-invert prose-sm text-center">
          <Story />
        </div>
      </section>
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
    "title": "Simple and Easy To-Do App",
    "points": [
      ["Simplicity", "Create tasks, do them, check them! It’s that simple. It should take less than 5 minutes to learn everything."],
      ["No Big Enterprise App", "No reminders, no notifications, no unnecessary complexities—just straightforward dumping todos."],
      ["When You Check a Task, It Won’t Disappear!", "Celebrate the actions you’ve taken, not just what’s left to do."],
      ["Fresh Start Every Day", "All tasks are time-bound. Missed a task? No worries—it moves to your history. Maybe it was going to the moon. We can’t do it all!"]
    ]
  },
  {
    "title": "Get Cool Reports",
    "points": [
      ["See Your Actions in Numbers", "Motivation often comes after taking action."],
      ["See Your Persistence", "Weekly and monthly charts show how much you’ve accomplished or missed."],
      ["Move Those Numbers Toward Completion", "Start reading that book you’ve been putting off for six months!"],
      ["Cool Charts and Graphs", "Who doesn’t love charts? We’ll even keep some exclusive ones for premium members!"],
      ["AI Reports!!!", "Everything is AI-powered these days, so why not here? It’d be cool, right?"]
    ]
  },
  {
    "title": "Journal and Timeline",
    "points": [
      ["Keep a History Timeline of Your Todos", "Track those bits of action you’ve taken! Periodically browse your journal, see what you’ve missed, and maybe tackle them now."],
      ["Did You Build Some Atomic Habits?", "Repeating tasks and habit tracking might come later—if that’s what you like. But this app will always stay simple. No more than 5 minutes to learn it all!"],
      ["Are You Getting 1% Better Every Day?", "Reflect on what you could improve. What mattered, and what wasn’t worth it?"],
      ["A Timeline of Future Todos", "Focus on today or tomorrow, but planning for future todos is always supported!"]
    ]
  }
]
