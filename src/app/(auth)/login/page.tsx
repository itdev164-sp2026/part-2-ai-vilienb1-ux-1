"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus } from "lucide-react"
import { toast } from "sonner"

import {
  authenticateUser,
  type AuthActionState,
} from "@/app/actions"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type AuthMode = "sign-in" | "sign-up"

const initialState: AuthActionState = {
  success: false,
  message: null,
  fieldErrors: {},
  authenticated: false,
}

function toErrorEntries(messages?: string[]) {
  return messages?.map((message) => ({ message }))
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [state, formAction] = useActionState(authenticateUser, initialState)

  const emailErrors = useMemo(
    () => toErrorEntries(state.fieldErrors.email),
    [state.fieldErrors.email]
  )
  const passwordErrors = useMemo(
    () => toErrorEntries(state.fieldErrors.password),
    [state.fieldErrors.password]
  )
  const modeErrors = useMemo(
    () => toErrorEntries(state.fieldErrors.mode),
    [state.fieldErrors.mode]
  )

  useEffect(() => {
    if (!state.message) {
      return
    }

    if (state.success) {
      toast.success(state.message)

      if (state.authenticated) {
        router.push("/projects")
      }

      return
    }

    toast.error(state.message)
  }, [router, state.authenticated, state.message, state.success])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_38%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.35))]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_hsl(var(--border)/0.25)_1px,_transparent_1px),linear-gradient(to_bottom,_hsl(var(--border)/0.25)_1px,_transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_bottom,white,transparent_85%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
        <div className="absolute right-4 top-4 md:right-6 md:top-6">
          <ModeToggle />
        </div>

        <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-2xl shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-card/90">
          <CardHeader className="space-y-3">
            <div className="inline-flex w-fit items-center rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Authentication
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to access your project dashboard or create a new account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/40 p-1">
              <Button
                type="button"
                variant={mode === "sign-in" ? "default" : "ghost"}
                className="justify-center"
                onClick={() => setMode("sign-in")}
              >
                <LogIn />
                Sign In
              </Button>
              <Button
                type="button"
                variant={mode === "sign-up" ? "default" : "ghost"}
                className="justify-center"
                onClick={() => setMode("sign-up")}
              >
                <UserPlus />
                Sign Up
              </Button>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="mode" value={mode} />

              <Field>
                <FieldLabel>
                  <span>Email</span>
                </FieldLabel>
                <FieldContent>
                  <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
                  <FieldError errors={emailErrors} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <span>Password</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    name="password"
                    type="password"
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    placeholder="Enter your password"
                  />
                  <FieldError errors={passwordErrors} />
                </FieldContent>
              </Field>

              <FieldError errors={modeErrors} />

              <Button type="submit" className="w-full">
                {mode === "sign-in" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}