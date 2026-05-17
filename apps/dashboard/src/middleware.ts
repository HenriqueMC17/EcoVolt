import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes (like sign-in and sign-up)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Protect all routes under the root, except static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|ico)).*)",
  ],
};
