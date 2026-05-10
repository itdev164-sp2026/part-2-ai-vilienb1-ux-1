"use server"

import { projectSchema } from "@/lib/schemas"
import { supabase } from "@/lib/supabase"

export async function createProject(formData: unknown) {
  // Validate the data server-side using safeParse
  const validationResult = projectSchema.safeParse(formData)

  if (!validationResult.success) {
    // Return validation errors
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      message: "Validation failed",
      errors,
    }
  }

  try {
    const validatedData = validationResult.data

    // Insert into Supabase
    const { data, error } = await supabase
      .from("project")
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
      message: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}
