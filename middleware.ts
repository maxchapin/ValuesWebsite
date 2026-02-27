import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const existing = request.cookies.get("ab_variant")?.value;
  const variant =
    existing === "A" || existing === "B"
      ? existing
      : Math.random() < 0.5
        ? "A"
        : "B";

  const response = NextResponse.next();

  if (!existing) {
    response.cookies.set("ab_variant", variant, {
      httpOnly: false,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

