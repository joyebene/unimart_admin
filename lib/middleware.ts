import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("admin_token");

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.includes("/admin/login")
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}