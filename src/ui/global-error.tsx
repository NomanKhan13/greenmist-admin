import { useRouteError, isRouteErrorResponse, Link } from "react-router"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileQuestion } from "lucide-react"

export default function GlobalError() {
  const error = useRouteError()

  // 1. This will catch error for when user hits a route which doesn't exist
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 text-center text-foreground">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          {error.status}
        </h1>
        <p className="mt-2 text-lg font-medium text-muted-foreground">
          {error.statusText}
        </p>
        {error.data?.message && (
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {error.data.message}
          </p>
        )}
        <Button asChild className="mt-8">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  // 2. Unexpected System/Network Errors like invalid credentials, Auth session not found and so on
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 text-center text-foreground">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">
        System Interruption
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred while communicating with the server."}
      </p>
      <Button onClick={() => window.location.reload()} className="mt-8">
        Refresh System
      </Button>
    </div>
  )
}
