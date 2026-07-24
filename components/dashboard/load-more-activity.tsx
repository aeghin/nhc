"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityRow } from "@/components/dashboard/activity-row";
import { fetchMoreActivity } from "@/lib/actions/activity";
import type { ActivityItem } from "@/lib/services/activity";

interface LoadMoreActivityProps {
  organizationId: string;
  initialCursor: string;
}

export const LoadMoreActivity = ({
  organizationId,
  initialCursor,
}: LoadMoreActivityProps) => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (!cursor) return;
    setError(null);

    startTransition(async () => {
      const res = await fetchMoreActivity(organizationId, cursor);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    });
  };

  return (
    <>
      {items.map((item, i) => (
        // i % 10 resets the animation stagger per batch so the delay never
        // compounds as the feed grows deeper.
        <ActivityRow key={item.id} item={item} index={i % 10} />
      ))}

      {cursor && (
        <div className="flex flex-col items-center gap-2 p-4">
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </>
  );
};
