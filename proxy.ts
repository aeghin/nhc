import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/(.*)",
  "/setup(.*)",
]);

const isWebhookRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isWebhookRoute(req)) return;

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const { userId } = await auth();

  if (!userId) return;

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/", "/dashboard(.*)", "/setup(.*)", "/api(.*)", "/invite(.*)"],
};
