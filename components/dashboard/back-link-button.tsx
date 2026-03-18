import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href: string
  label: string
}

export const BackLink = ({ href, label }: BackLinkProps) => (
  <Link
    href={href}
    className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
    {label}
  </Link>
)