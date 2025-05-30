'use clientّ'

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: (segment: string | null) => boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const segment = useSelectedLayoutSegment()
  const { setOpenMobile, isMobile } = useSidebar()
  const handleClick = () => {
    if (isMobile) setOpenMobile(false)
  }
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={item.isActive?.(segment)} asChild size="lg"
              >
                <Link href={item.url} onClick={handleClick}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
