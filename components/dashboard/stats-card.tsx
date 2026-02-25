import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
};

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/40 bg-linear-to-br from-card to-card/80 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-semibold",
                    trend.positive ? "text-chart-1" : "text-destructive",
                  )}
                >
                  {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trend.value}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-200 group-hover:scale-110">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
