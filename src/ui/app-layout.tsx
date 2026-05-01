import { Outlet, useNavigation } from "react-router"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import LoadingScreen from "./loading-screen"
import { Toaster } from "sonner"

export default function AppLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <SidebarProvider
      className="selection:bg-emerald-300 selection:text-emerald-900"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative">
        <SiteHeader />
        <Outlet />
        <Toaster
          toastOptions={{
            classNames: {
              toast: "bg-card",
              description: "text-card-foreground",
            },
          }}
        />
        {isLoading && <LoadingScreen />}
      </SidebarInset>
    </SidebarProvider>
  )
}
