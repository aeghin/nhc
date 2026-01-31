import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from './lib/prisma';

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/(.*)",
  "/setup(.*)",
]);

const isWebhookRoute = createRouteMatcher([
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {

  

  if (isWebhookRoute(req)) return;

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const { userId } = await auth();
  
  if (!userId) return;

  if (req.nextUrl.pathname.startsWith('/dashboard')) {

    const membershipsCount = await prisma.membership.count({
      where: { user : { clerkId: userId } },
    });

    if (membershipsCount < 1) return NextResponse.redirect(new URL('/setup', req.url));
    
  };

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}