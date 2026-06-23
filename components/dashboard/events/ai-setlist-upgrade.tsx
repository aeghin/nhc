import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AiSetlistUpgrade() {
  return (
    <Card>
      <CardContent className="flex h-120 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI setlist generation</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Describe the vibe and let AI build a setlist from your catalog.
            Available on a premium plan.
          </p>
        </div>
        <Button asChild size="sm" className="cursor-pointer">
          <Link href="/#pricing">
            <Lock className="mr-1.5 h-3.5 w-3.5" />
            Upgrade to unlock
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
