"use client";

import { useTransition } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { openBillingPortal } from "@/lib/actions/billing";

export function ManageSubscriptionButton({ orgId }: { orgId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleManage = () => {
    startTransition(async () => {
      const result = await openBillingPortal(orgId);
      if (result.success) {
        // Full navigation — the Customer Portal is an external Stripe URL.
        window.location.href = result.url;
      } else {
        toast.error(result.error, { position: "top-center" });
      }
    });
  };

  return (
    <Button
      onClick={handleManage}
      disabled={isPending}
      variant="outline"
      size="sm"
      className="cursor-pointer"
    >
      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
      {isPending ? "Opening…" : "Manage subscription"}
    </Button>
  );
}
