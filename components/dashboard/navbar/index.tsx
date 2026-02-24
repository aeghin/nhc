
import Link from "next/link";
import { Command, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { NavLinks } from "./nav-links";
// import { NotificationsMenu } from "./notifications-menu";
// import type { Notification, User } from "@/lib/types"
import { UserButton } from "@clerk/nextjs";

// interface NavbarProps {
//   notifications: Notification[]
//   // user: User
// }

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
              <Command className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">NHC</span>
          </Link>

          {/* <NavLinks isAdmin={user.isAdmin} /> */}
        </div>

        <div className="flex items-center gap-2">
          {/* <NotificationsMenu notifications={notifications} /> */}

          <UserButton />
        </div>
      </div>
    </header>
  )
}
