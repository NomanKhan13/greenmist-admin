import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router"
import { supabase } from "@/lib/supabse"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const actionData = useActionData()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="space-y-4 py-8">
        <CardHeader>
          <CardTitle>GreenMist Staff Portal</CardTitle>
          <CardDescription>Authorized staff access only</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Work Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="frontdesk@greenmist.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 cursor-pointer py-6 hover:brightness-115"
                >
                  {isSubmitting ? "Authenticating..." : "Sign In"}
                </Button>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
      {actionData?.login && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {actionData.login}
        </div>
      )}
    </div>
  )
}

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))

  if (!email || !password)
    return {
      error: "Please enter your email and password.",
    }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError)
    return {
      error: "Invalid credentials. Please verify your work email and password.",
    }

  // When user is redirected to /dashboard, that route checks if user is authenticated as staff or not
  return redirect("/dashboard")
}
