import { ProjectForm } from "@/components/project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Create
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            New Project
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Fill out the details below to create a new project in your portfolio.
          </p>
        </div>
      </section>

      <section className="max-w-2xl rounded-xl border border-border/70 bg-card p-6">
        <ProjectForm />
      </section>
    </div>
  )
}
