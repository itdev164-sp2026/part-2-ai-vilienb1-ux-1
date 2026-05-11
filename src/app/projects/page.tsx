import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type Project = {
  id: string | number;
  title: string | null;
  description: string | null;
  status: string | null;
};

const statusStyles: Record<string, string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  completed: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  archived: "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
};

function getStatusStyles(status: string | null) {
  if (!status) {
    return statusStyles.archived;
  }

  return statusStyles[status.toLowerCase()] ?? statusStyles.archived;
}

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, status");

  const projects = (data ?? []) as Project[];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Projects
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Project Portfolio
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              A concise view of the current work stream, surfaced directly from
              Supabase for a fast server-rendered dashboard experience.
            </p>
          </div>
          <Link href="/projects/new">
            <Button className="shrink-0">New Project</Button>
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          Unable to load projects right now. Please check the Supabase table
          connection and try again.
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No projects found in the database yet.
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border-border/70 bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="gap-3 border-b border-border/60 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">
                    {project.title ?? "Untitled Project"}
                  </CardTitle>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                      getStatusStyles(project.status)
                    )}
                  >
                    {project.status ?? "archived"}
                  </span>
                </div>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                  {project.description ?? "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                <p>Project ID: {project.id}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}