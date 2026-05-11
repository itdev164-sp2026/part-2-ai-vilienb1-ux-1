"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { projectSchema, type Project } from "@/lib/schemas"
import { createProject } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/components/ui/field"

export function ProjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
  })

  const statusValue = watch("status")

  async function onSubmit(data: Project) {
    try {
      const result = await createProject(data)

      if (result.success) {
        toast.success("Project created successfully!")
        reset()
      } else {
        toast.error(result.message || "Failed to create project")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel>
          <span>Project Title</span>
        </FieldLabel>
        <FieldContent>
          <Input
            placeholder="Enter project title"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          {errors.title && <FieldError errors={[errors.title]} />}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>
          <span>Description</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Enter project description"
            {...register("description")}
            aria-invalid={!!errors.description}
            rows={4}
          />
          {errors.description && <FieldError errors={[errors.description]} />}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>
          <span>Status</span>
        </FieldLabel>
        <FieldContent>
          <Select
            value={statusValue}
            onValueChange={(value) =>
              setValue("status", value as "active" | "completed" | "archived")
            }
          >
            <SelectTrigger aria-invalid={!!errors.status}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <FieldError errors={[errors.status]} />}
        </FieldContent>
      </Field>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Project"}
      </Button>
    </form>
  )
}
