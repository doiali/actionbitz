import React from "react"
import StartButton from '@/components/start-button'
import img_now from '@/../public/static/todo-app-now.png'
import img_past from '@/../public/static/todo-app-past.png'
import img_report from '@/../public/static/todo-app-report.png'
import Image, { StaticImageData } from 'next/image'
import { Check, Wrench } from 'lucide-react'
import clsx from 'clsx'
import Story from './home-page-story.mdx'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'


export default function Home() {
  return (
    <div className="flex flex-col px-4">
      <section className="flex justify-center items-center text-center min-h-[100vh] py-24 border-b">
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-3xl sm:text-5xl lg:text-6xl">
            Simple Journaling Todo App
          </h1>
          <p className="text-muted-foreground">For busy individuals with <span className="font-bold text-lg">lots of</span> todos!</p>
          <p className="text-muted-foreground mb-4">Those who know <i>plannig to do the thing is not doing the thing!</i></p>
          <StartButton />
        </div>
      </section>
      <section className="bg-background/85 pt-12 pb-24 border-b">
        <div className="py-12 relative w-full max-w-3xl mx-auto">
          <h1 className="relative text-center text-3xl font-bold px-4">How it works?</h1>
        </div>
        <div className="w-full max-w-3xl mx-auto flex flex-col">
          <Item img={img_now} data={data[0]} index={1} />
          <Item img={img_report} data={data[1]} reverse index={2} />
          <Item img={img_past} data={data[2]} index={3} />
        </div>
      </section >
      <section className="flex flex-col items-center text-center py-24">
        <h2 className="font-bold text-3xl mb-4">My story</h2>
        <h3 className="font-bold text-lg mb-4">Why Did I Build a Todo App in 2025?</h3>
        <div className="prose dark:prose-invert prose-sm text-center">
          <Story />
        </div>
      </section>
      <section className="py-24 bg-background/85 border-t">
        <div className="flex flex-col w-full max-w-3xl mx-auto">
          <h2 className="font-bold text-3xl mb-6 text-center">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
            <PriceCard data={plans[0]} />
            <PriceCard data={plans[1]} />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-10 max-w-xl mx-auto">
            Please note that Actionbitz is still in its early stages and requires further testing. If you encounter any issues, I’d greatly appreciate it if you could report them. And if you have any suggestions or feedback, don’t hesitate to let me know. I’d love to hear from you!
          </p>
        </div>
      </section>
    </div >
  )
}


const PriceCard: React.FC<{ data: Plan }> = ({ data: { items, title, cta, price } }) => {
  return (
    <Card className="px-2">
      <CardHeader>
        <h2 className="font-bold text-x text-muted-foreground">{title}</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="mb-2">
          {!!price ? (
            <p><span className="text-3xl font-bold">${price}/<span className="text-sm text-muted-foreground">month</span></span></p>
          ) : (
            <span className="text-3xl font-bold">Free</span>
          )}
        </div>
        <div className="flex flex-col">
          {cta
            ? <StartButton variant="outline" className="border-primary" />
            : <Button variant="outline" disabled>
              <Wrench className="" />
              Comming soon
            </Button>
          }
        </div>
        <ul className="flex flex-col py-4 gap-4">
          {items.map(([title, ready], i) => (
            <li key={i} className="text-base text-muted-foreground flex gap-4">
              {ready
                ? <Check className="text-primary" />
                : <Wrench className="text-muted-foreground/25" />
              }
              {title}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
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
        <h2 className="font-semibold text-2xl mt-4 text-center">{data.title}</h2>
      </div>
      <div className="py-12 gap-12 flex flex-col md:flex-row md:items-start">
        <Image src={img} alt="app-now" className={clsx("w-[18rem] mx-auto md:mx-0 rounded-xl dark:border h-[30rem] object-contain object-[0_1rem]", reverse && 'order-1 md:order-2')} />
        <div className={clsx("flex flex-col gap-4 grow", reverse && 'order-2 md:order-1', !reverse && '')}>
          {data.points.map(([title, description], i) => (
            <div className="flex gap-4 py-2 rounded-xl" key={i}>
              <Check className="shrink-0 border-2 bg-primary text-primary-foreground w-10 h-10 p-2 rounded-full" />
              <div className="flex flex-col gap-2">
                <h4>
                  {title}
                </h4>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
type Plan = {
  title: string,
  items: [string, boolean][],
  cta?: string,
  price?: number,
}
const plans: Plan[] = [
  {
    title: 'Basic',
    items: [
      ['Unlimited todos', true],
      ['Unlimited hisory', true],
      ['Reports: last 30 days', true],
      ['Subtasks', false],
    ],
    cta: 'Get started',
  },
  {
    title: 'Premium',
    items: [
      ['All in free', true],
      ['Unlimited reports', true],
      ['Labels and Categories', false],
      ['Calendar integrations', false],
      ['Export reports', false],
      ['AI features', false],
    ],
    price: 3.99,
  }
]



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
