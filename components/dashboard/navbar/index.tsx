import Link from "next/link";
import { Command } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NavLinks } from "./nav-links";
import { PremiumNav } from "./premium-nav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
              <Command className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Aeghin</span>
          </Link>
          <NavLinks />
        </div>

        <div className="flex items-center gap-3">
          <PremiumNav />
          <UserButton
            appearance={{ elements: { avatarBox: { width: "36px", height: "36px" } } }}
          />
        </div>
      </div>
    </header>
  );
}
