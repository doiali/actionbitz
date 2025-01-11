"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'

const getUserInitials = (user: User) => {
  if (!user.name) return ""
  const initials = user.name.split(" ").map((n) => n[0]).join("")
  return initials
}
const UserWidget = ({ user }: { user: User }) => {
  return (
    <>
      <Avatar className="h-9 w-9 rounded-lg">
        {user.image && <AvatarImage src={user.image} alt={user.name || user.email || user.id} />}
        <AvatarFallback className="rounded-lg">{getUserInitials(user)}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-sm text-muted-foreground">{user.email}</span>
      </div>
    </>
  )
}

export function UserMenu() {
  const { data } = useSession()
  const { isMobile } = useSidebar()
  if (!data?.user) return null
  const { user } = data
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-1"
            >
              <UserWidget user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            alignOffset={20}
            sideOffset={-20}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserWidget user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ redirectTo: '/' })}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
