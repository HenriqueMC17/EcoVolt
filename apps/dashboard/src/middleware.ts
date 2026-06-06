import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isClerkPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const runClerkMiddleware = clerkMiddleware(async (auth, request) => {
  if (!isClerkPublicRoute(request)) {
    await auth.protect();
  }
});

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isMock = !clerkKey || clerkKey === "dummy";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // Skip static assets and API routes early to optimize edge performance
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isMock) {
    const sessionCookie = request.cookies.get("ecovolt-session")?.value;

    if (!sessionCookie && pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionCookie && pathname === "/login") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Live Clerk mode delegation
  const response = await runClerkMiddleware(request, event);
  
  if (response) {
    return response;
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Protect all routes under the root, except static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|ico)).*)",
  ],
};

