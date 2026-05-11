"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { FolderOpen, Home, Settings, LogOut } from "lucide-react";

import { signOutUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

type AppSidebarProps = {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex h-8 items-center rounded-md px-2 text-sm font-semibold">
          Course Dashboard
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === item.url
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <div className="space-y-3 px-2">
            <div className="space-y-0.5">
              <p className="text-xs text-sidebar-foreground/70">Signed in as</p>
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.email ?? "Authenticated user"}
              </p>
            </div>
            <form action={signOutUser}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full justify-start border-sidebar-border/80 bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut />
                Sign Out
              </Button>
            </form>
          </div>
        ) : (
          <p className="px-2 text-xs text-sidebar-foreground/70">ITDEV-164</p>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
