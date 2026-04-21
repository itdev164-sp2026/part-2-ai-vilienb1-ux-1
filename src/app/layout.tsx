import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import {TooltipProvider} from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardTopNav } from "@/components/dashboard-top-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITDEV-164 — Course Dashboard",
  description: "AI-native web development with Next.js, Tailwind, and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
        
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <DashboardTopNav />
              <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
            </SidebarInset>
          </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
