
export const SERVICE_TYPE_COLORS = [
  "indigo",
  "amber",
  "emerald",
  "pink",
  "violet",
  "red",
  "blue",
  "cyan",
] as const;

export const serviceColorClasses: Record<
  string,
  { dot: string; border: string; badge: string; badgeText: string }
> = {
  indigo: {
    dot: "bg-indigo-500",
    border: "border-l-indigo-500",
    badge: "bg-indigo-500/10",
    badgeText: "text-indigo-600",
  },
  amber: {
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    badge: "bg-amber-500/10",
    badgeText: "text-amber-600",
  },
  emerald: {
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    badge: "bg-emerald-500/10",
    badgeText: "text-emerald-600",
  },
  pink: {
    dot: "bg-pink-500",
    border: "border-l-pink-500",
    badge: "bg-pink-500/10",
    badgeText: "text-pink-600",
  },
  violet: {
    dot: "bg-violet-500",
    border: "border-l-violet-500",
    badge: "bg-violet-500/10",
    badgeText: "text-violet-600",
  },
  red: {
    dot: "bg-red-500",
    border: "border-l-red-500",
    badge: "bg-red-500/10",
    badgeText: "text-red-600",
  },
  blue: {
    dot: "bg-blue-500",
    border: "border-l-blue-500",
    badge: "bg-blue-500/10",
    badgeText: "text-blue-600",
  },
  cyan: {
    dot: "bg-cyan-500",
    border: "border-l-cyan-500",
    badge: "bg-cyan-500/10",
    badgeText: "text-cyan-600",
  },
};

export const getServiceColorClasses = (color: string) =>
  serviceColorClasses[color] || serviceColorClasses.indigo;
