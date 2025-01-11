'use client'

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { UserMenu } from './user-menu'
import { ChartPie, CircleCheckBig, House, LifeBuoy, Send } from 'lucide-react'
import { NavSecondary } from './nav-secondary'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserMenu />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navPrimary} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar >
  )
}

const data = {
  navPrimary: [
    {
      title: "Actions",
      url: "/dashboard/now",
      icon: CircleCheckBig,
      isActive: (segment: string | null) => segment === '(app)',
    },
    {
      title: "Reports",
      url: "/dashboard/report",
      icon: ChartPie,
      isActive: (segment: string | null) => segment === 'report',
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
    {
      title: "Landing Page",
      url: "/",
      icon: House,
    },
  ]
}