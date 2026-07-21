import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border-2 border-border/40 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchX className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mb-6 text-muted-foreground">
          This page doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button className="w-full cursor-pointer shadow-lg shadow-primary/25">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full cursor-pointer">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
