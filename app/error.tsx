"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border-2 border-border/40 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred. Try again, and if it keeps happening,
          check back in a few minutes.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="cursor-pointer">
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full cursor-pointer">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
