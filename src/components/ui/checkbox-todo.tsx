"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { EntryStatus } from '@prisma/client'

type CheckboxTodoProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  status?: EntryStatus
}

const CheckboxTodo: React.FC<CheckboxTodoProps> = ({
  className, status = 'todo', ...props
}) => (
  <CheckboxPrimitive.Root
    className={cn(
      "peer group h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-transparent data-[state=checked]:text-muted-foreground data-[state=checked]:border-none relative",
      className
    )}
    {...props}
    checked={status !== 'todo'}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {status === 'done' && <Check className="h-6 w-6 absolute" />}
      {status === 'ignored' && <Minus className="h-6 w-6 absolute" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
CheckboxTodo.displayName = CheckboxPrimitive.Root.displayName

export { CheckboxTodo }
