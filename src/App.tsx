import { createBrowserRouter, redirect, RouterProvider } from "react-router"

import Login from "./pages/login"
import AppLayout from "./ui/app-layout"
import Dashboard from "./pages/dashboard"
import Rooms from "./pages/rooms"
import { getUserData } from "./lib/auth-api"
import GlobalError from "./ui/global-error"
import { loginAction } from "./components/login-form"
import Reservations from "./pages/reservations"
import Housekeeping from "./pages/house-keeping"
import Settings from "./pages/settings"

export async function requiresAuth() {
  const isAuthenticated = await getUserData()
  if (!isAuthenticated) throw redirect("/login")
  return null
}

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
  return <RouterProvider router={router} />
}

export default App
