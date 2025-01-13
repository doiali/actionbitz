import { User } from 'next-auth'
import { prisma } from './prisma'

export default async function seedUserTodos({ id }: User) {
  try {
    if (id) {
      await prisma.entry.createMany({
        data: data.map(([completed, d, title]) => ({
          title,
          completed,
          type: 'TODO',
          date: new Date(Date.now() + d * 24 * 60 * 60 * 1000),
          userId: id,
        }))
      })
    }
  } catch (e) {
    console.error(`Error creating initial demo todos for ${id}:`)
    console.error(e)
  }
}

const data = [
  [false, -7, 'Finish reading that book I always postponed.'],
  [true, -6, 'Do some chores.'],
  [false, -6, 'Try learning a new skill.'],
  [false, -6, 'Watched an entire series in one weekend.'],
  [true, -5, 'Cleaned my desk. It’s sparkling now!'],
  [false, -4, 'Ate way too much pizza. No regrets.'],
  [true, -4, 'Create a playlist that I’ll probably never listen to.'],
  [true, -4, 'Take a long walk to nowhere in particular.'],
  [false, -2, 'Finally organize my digital photos.'],
  [true, -2, 'Lose track of time scrolling on my phone.'],
  [true, -1, 'Cook something experimental and survived!'],
  [true, +0, 'Get started with ActionBitz.'],
  [false, +0, 'Explore past and future.'],
  [false, +0, 'Explore cool reports.'],
  [false, +0, 'Add 3 todos and get them done!'],
  [false, +0, 'Add 3 todos for tomorrow.'],
  [false, +1, 'Find a way to get 1% better.'],
  [false, +1, 'Follow doiali on X.'],
  [false, +1, 'Keep on showing up and continue getting things done'],
  [false, +1, 'Exploring remaining Actionbitz features.'],
  [false, +2, 'Start journaling consistently every day.'],
  [false, +2, 'Find one thing I can improve and write it down.'],
  [false, +2, 'Send feedback to help improve this app.'],
  [false, +3, 'Creating a todo list... for making more todo lists.'],
  [false, +5, 'Celebrate small wins!'],
  [false, +7, 'Write a review for ActionBitz'],
  [false, +9, 'Invite a friend to ActionBitz'],
  [false, +11, 'Brainstorm your big dreams'],
  [false, +14, 'Reflect on my progress and set new goals.'],
  [false, +17, 'Learn something new, like coding in a different language.'],
  [false, +30, 'Finally complete a 30-day challenge!'],
] as const