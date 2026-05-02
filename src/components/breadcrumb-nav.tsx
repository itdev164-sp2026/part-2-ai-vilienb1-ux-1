"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const NAME_MAP: Record<string, string> = {
  "/": "Overview",
  "/projects": "Projects",
  "/settings": "Settings",
};

function formatPathname(pathname: string) {
  return NAME_MAP[pathname] ??
    pathname
      .split("/")
      .filter(Boolean)
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" /");
}

export function BreadcrumbNav() {
  const pathname = usePathname() ?? "/";
  const page = formatPathname(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ITDEV-164</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <div className="contents">
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {pathname === "/" ? (
              <BreadcrumbPage>Overview</BreadcrumbPage>
            ) : (
              <BreadcrumbPage>{page}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </div>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbNav;
