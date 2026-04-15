import { LoginForm } from "@/components/login-form"
import { Mountain } from "lucide-react"

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Mountain className="size-4" />
          </div>
          GreenMist Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
