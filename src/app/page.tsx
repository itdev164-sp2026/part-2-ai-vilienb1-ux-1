import { Code, Cpu, Layout, Rocket, Server, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";

const assignments = [
  {
    week: 1,
    title: "Setup & Next.js Scaffolding",
    description: "Initialize your project, configure tooling, and verify your AI-assisted workflow.",
    icon: Rocket,
  },
  {
    week: 2,
    title: "Agentic UI with Shadcn",
    description: "Build dashboard layouts and reusable components with Shadcn/ui and Tailwind.",
    icon: Layout,
  },
  {
    week: 3,
    title: "Server Components & Data Fetching",
    description: "Leverage React Server Components and async data patterns in the App Router.",
    icon: Server,
  },
  {
    week: 4,
    title: "AI-Driven Forms & Validation",
    description: "Create forms with Zod schemas and Server Actions for type-safe data handling.",
    icon: Code,
  },
  {
    week: 5,
    title: "Full-Stack Integration",
    description: "Connect Supabase for authentication, database operations, and real-time data.",
    icon: Cpu,
  },
  {
    week: 6,
    title: "Deployment & AI Testing",
    description: "Deploy to Vercel, set up webhooks, and write AI-assisted tests.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Navbar />
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Course Dashboard
        </h1>
        <p className="text-muted-foreground">
          ITDEV-164 — Web Programming 2: AI-native full-stack development with
          Next.js, Tailwind&nbsp;CSS, and Supabase.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assignments.map(({ week, title, description, icon: Icon }) => (
          <div
            key={week}
            className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Week {week}
              </span>
            </div>
            <h2 className="mb-1 font-semibold leading-snug">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
