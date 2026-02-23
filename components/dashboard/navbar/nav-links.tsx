"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavLinksProps {
  isAdmin: boolean
}

// Define outside component - static, not recreated on each render
const BASE_LINKS = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/organizations", label: "Organizations", exact: false },
  { href: "/dashboard/events", label: "Events", exact: true, icon: Calendar },
]

const ADMIN_LINKS = [
  { href: "/dashboard/users", label: "Users", exact: true },
  { href: "/dashboard/settings", label: "Settings", exact: true },
]

export function NavLinks({ isAdmin }: NavLinksProps) {
  const pathname = usePathname()

  const links = isAdmin ? [...BASE_LINKS, ...ADMIN_LINKS] : BASE_LINKS

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {links.map((link) => {
        const Icon = link.icon
        const active = isActive(link.href, link.exact)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            {Icon && <Icon className="mr-1.5 inline h-3.5 w-3.5" />}
            {link.label}
            {active && (
              <span className="absolute inset-x-3 -bottom-3.25 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
