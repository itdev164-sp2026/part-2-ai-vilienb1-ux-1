"use server"

import { z } from "zod"
import { redirect } from "next/navigation"

import { projectSchema } from "@/lib/schemas"
import { createSupabaseServerActionClient } from "@/lib/supabase/actions"

const authSchema = z.object({
  mode: z.enum(["sign-in", "sign-up"]),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type AuthActionState = {
  success: boolean
  message: string | null
  fieldErrors: Partial<Record<"email" | "password" | "mode", string[]>>
  authenticated: boolean
}

const initialFieldErrors: AuthActionState["fieldErrors"] = {}

export async function authenticateUser(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const payload = {
    mode: formData.get("mode"),
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const validationResult = authSchema.safeParse(payload)

  if (!validationResult.success) {
    const flattened = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        email: flattened.email,
        password: flattened.password,
        mode: flattened.mode,
      },
      authenticated: false,
    }
  }

  const supabase = await createSupabaseServerActionClient()
  const { mode, email, password } = validationResult.data

  const authResult =
    mode === "sign-in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

  if (authResult.error) {
    return {
      success: false,
      message: authResult.error.message,
      fieldErrors: initialFieldErrors,
      authenticated: false,
    }
  }

  const authenticated = Boolean(authResult.data.session)

  return {
    success: true,
    message:
      mode === "sign-in"
        ? "Signed in successfully."
        : authenticated
          ? "Account created and signed in successfully."
          : "Account created. Check your email to confirm your sign-up.",
    fieldErrors: initialFieldErrors,
    authenticated,
  }
}

export async function signOutUser() {
  const supabase = await createSupabaseServerActionClient()

  await supabase.auth.signOut()
  redirect("/login")
}

export async function createProject(formData: unknown) {
  const validationResult = projectSchema.safeParse(formData)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      message: "Validation failed",
      errors,
    }
  }

  try {
    const supabase = await createSupabaseServerActionClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      return {
        success: false,
        message: "You must be signed in to create a project.",
      }
    }

    const validatedData = validationResult.data
    const { data, error } = await supabase
      .from("projects")
      .insert([validatedData])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        message: error.message || "Failed to create project",
      }
    }

    return {
      success: true,
      message: "Project created successfully",
      data,
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create project",
    }
  }
}
