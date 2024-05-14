import { NextRequest, NextResponse } from "next/server";
import { useRouter } from "next/router";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPages =
    pathname === "/signin" || pathname === "/signup" || pathname === "/";
  const isPrivatePages =
    pathname === "/home" || pathname === "/projects" || pathname === "/profile";

  let isIdAvailable: string =
    String(request.cookies.get("userId")?.value) || "";

 /*  if (isIdAvailable && isPublicPages) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  if (!isIdAvailable && isPrivatePages) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  } */
}

export const config = {
  matcher: ["/", "/signup", "/signin", "/home", "/profile", "/projects"],
};
