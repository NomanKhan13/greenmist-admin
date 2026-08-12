import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router"
import { data } from "./app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const location = useLocation()
  const pathName = location.pathname
  const pathSegments = pathName.split("/").filter(Boolean)
  let breadcrumbItems = []
  if (pathSegments[0] === "reservations") {
    breadcrumbItems.push({
      name: "Reservations",
      href: "/reservations",
    })
    if (pathSegments[1]) {
      breadcrumbItems.push({
        name: `Create Reservation`,
        href: `/reservations/new`,
      })
    }
  }
  console.log("breadcrumbItems", breadcrumbItems)
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((breadcrumb, idx) => {
            if (breadcrumbItems.length - 1 === idx) {
              return (
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                </BreadcrumbItem>
              )
            }
            return (
              <>
                <BreadcrumbItem
                  key={`${breadcrumb.href}${idx}`}
                  className={cn(idx === 0 ? "hidden md:block" : "")}
                >
                  <BreadcrumbLink href={breadcrumb.href}>
                    {breadcrumb.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
