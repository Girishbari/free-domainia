import { NextRequest, NextResponse } from "next/server";
import { useRouter } from "next/router";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPages =
    pathname === "/signin" || pathname === "/signup" || pathname === "/";
  const isPrivatePages =
    pathname === "/home" || pathname === "/projects" || pathname === "/profile";

  let isIdAvailable: string = request.cookies.get("userId")?.value || "";

  if (isPublicPages && isIdAvailable) {
    console.log("first", isIdAvailable);

    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  if (isPrivatePages && !isIdAvailable) {
    console.log("second", isIdAvailable);

    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/signup", "/signin", "/home", "/profile", "/projects"],
};
