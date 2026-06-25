"use client";

import { useTransition } from "react";
import { Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startAiSetlistCheckout } from "@/lib/actions/billing";


export function AiSetlistUpgrade({ orgId, canSubscribe }: { orgId: string, canSubscribe: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    startTransition(async () => {
      const result = await startAiSetlistCheckout(orgId);
      if (result.success) {
        // Full navigation — Stripe Checkout is an external URL.
        window.location.href = result.url;
      } else {
        toast.error(result.error, { position: "top-center" });
      }
    });
  };

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
          {!canSubscribe && (
            <p className="mt-2 text-xs text-muted-foreground">
              Reach out to an organization owner to subscribe.
            </p>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleUpgrade}
          disabled={isPending || !canSubscribe}
          className="cursor-pointer"
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          {isPending ? "Redirecting…" : "Upgrade to unlock"}
        </Button>
      </CardContent>
    </Card>
  );
}
