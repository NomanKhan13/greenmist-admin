import { createBrowserRouter, redirect, RouterProvider } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Login from "./pages/login"
import AppLayout from "./ui/app-layout"
import Dashboard from "./pages/dashboard"
import Rooms, {
  addRoomTypeAction,
  loader as roomTypesLoader,
} from "./pages/rooms"
import { getUserData } from "./lib/auth-api"
import GlobalError from "./ui/global-error"
import { loginAction } from "./components/login-form"
import Reservations from "./pages/reservations"
import Housekeeping from "./pages/house-keeping"
import Settings from "./pages/settings"
import LoadingScreen from "./ui/loading-screen"

export async function requiresAuth() {
  const isAuthenticated = await getUserData()
  if (!isAuthenticated) throw redirect("/login")
  return null
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // default: true
    },
  },
})

export async function redirectIfAuth() {
  const isAuthenticated = await getUserData()
  if (isAuthenticated) throw redirect("/dashboard")
  return null
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    loader: requiresAuth,
    errorElement: <GlobalError />,
    shouldRevalidate: ({ currentUrl, nextUrl, defaultShouldRevalidate }) => {
      if (currentUrl.pathname === nextUrl.pathname) return false
      if (
        currentUrl.pathname === nextUrl.pathname &&
        currentUrl.search !== nextUrl.search
      ) {
        return false
      }
      return defaultShouldRevalidate
    },
    HydrateFallback: LoadingScreen,
    children: [
      {
        index: true,
        loader: () => redirect("dashboard"),
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "rooms",
        Component: Rooms,
        loader: () => roomTypesLoader(queryClient),
        action: addRoomTypeAction(queryClient),
      },
      {
        path: "reservations",
        Component: Reservations,
      },
      {
        path: "house-keeping",
        Component: Housekeeping,
      },
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
    errorElement: <GlobalError />,
    loader: redirectIfAuth,
    action: loginAction,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App

/**
 * How to implement Create, Update and duplicate.
 *
 * IMPLEMENTATION:
 * Create - All field should be empty and make a POST req when user submits the form.
 * Update - All field should be pre-filled based on room make a PUT req when user submits the form.
 * Duplicate - All field should be pre-filled with the word "copy" at the end based on room and make a POST req when user submits a the form.
 *
 * URL:
 * Create - No URL change (/rooms)
 * Update - /rooms?edit=room-slug
 * Duplicate - No URL change (/rooms)
 *
 */
