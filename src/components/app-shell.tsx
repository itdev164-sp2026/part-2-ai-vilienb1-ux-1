"use client"

import type { ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { usePathname } from "next/navigation"

import BreadcrumbNav from "@/components/breadcrumb-nav"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

type AppShellProps = {
  children: ReactNode
  user: User | null
}

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname() ?? "/"
  const isAuthRoute = pathname === "/login"

  if (isAuthRoute) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <BreadcrumbNav />
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}