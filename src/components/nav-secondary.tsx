"use client"

import * as React from "react"
import { Moon } from "lucide-react" // Make sure to import an icon for the toggle

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Toggle dark mode"
              className="h-12"
            >
              <button type="button" className="w-full text-left">
                <Moon />
                <span className="font-mono text-xs text-muted-foreground">
                  (Press{" "}
                  <kbd className="rounded border bg-muted/50 px-1 font-sans">
                    {" "}
                    d
                  </kbd>{" "}
                  to toggle)
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="h-12" asChild tooltip={item.title}>
                <Link to={item.url}>
                  {item.icon}
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
