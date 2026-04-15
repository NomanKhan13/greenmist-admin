import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  CalendarCheck,
  House,
  BrushCleaning,
  Mountain,
  Settings,
  UserPlus,
} from "lucide-react"
import { Link } from "react-router"
import { NavSecondary } from "./nav-secondary"

export const data = {
  user: {
    name: "Test User",
    email: "test@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Reservations",
      url: "/reservations",
      icon: <CalendarCheck />,
    },
    {
      title: "Rooms",
      url: "/rooms",
      icon: <House />,
    },
    {
      title: "Housekeeping",
      url: "/house-keeping",
      icon: <BrushCleaning />,
    },
  ],
  navSecondary: [
    {
      title: "Add New Staff",
      url: "/add-staff",
      icon: <UserPlus />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <Mountain className="size-7! rounded bg-primary p-1 text-stone-50" />
                <span className="text-base font-semibold">GreenMist Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
