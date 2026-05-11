import { NextResponse, type NextRequest } from "next/server"

import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options)
  })
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createSupabaseMiddlewareClient(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProjectsRoute = pathname.startsWith("/projects")
  const isLoginRoute = pathname === "/login"

  if (isProjectsRoute && !user) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url))
    copyCookies(response, redirectResponse)
    return redirectResponse
  }

  if (isLoginRoute && user) {
    const redirectResponse = NextResponse.redirect(new URL("/projects", request.url))
    copyCookies(response, redirectResponse)
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}