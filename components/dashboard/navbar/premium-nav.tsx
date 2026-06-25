"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getOrgPremiumStatus,
  startAiSetlistCheckout,
} from "@/lib/actions/billing";

type Status = { hasPremium: boolean; canSubscribe: boolean };

export function PremiumNav() {
  const pathname = usePathname();
  // Same derivation NavLinks uses, so this targets the org in view.
  const orgId = pathname.match(/^\/dashboard\/organizations\/([^/]+)/)?.[1];

  const [status, setStatus] = useState<Status | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!orgId) {
      setStatus(null);
      return;
    }
    let active = true;
    getOrgPremiumStatus(orgId)
      .then((s) => {
        if (active) setStatus(s);
      })
      .catch(() => {
        // Fail safe: a status fetch error must never break the navbar.
        if (active) setStatus(null);
      });
    return () => {
      active = false;
    };
  }, [orgId]);

  // Render nothing until we know the status (also avoids SSR/CSR mismatch).
  if (!orgId || !status) return null;

  if (status.hasPremium) {
    return (
      <Badge
        variant="secondary"
        className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      >
        <Sparkles className="h-3 w-3" />
        Premium
      </Badge>
    );
  }

  
  if (!status.canSubscribe) return null;

  const handleUpgrade = () => {
    startTransition(async () => {
      const result = await startAiSetlistCheckout(orgId);
      if (result.success) {
        window.location.href = result.url;
      } else {
        toast.error(result.error, { position: "top-center" });
      }
    });
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isPending}
      size="sm"
      className="cursor-pointer"
    >
      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
      {isPending ? "Redirecting…" : "Get Premium"}
    </Button>
  );
}
