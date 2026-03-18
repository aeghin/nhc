"use client";

import { cn } from "@/lib/utils";

import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  Mail,
  Settings,
  Users,
} from "lucide-react";

const tabIcons: Record<string, typeof Calendar> = {
  events: Calendar,
  members: Users,
  invitations: Mail,
  settings: Settings,
};

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface OrgTabNavProps {
  tabs: Tab[];
  activeTab: string;
}

export const OrgTabNav = ({ tabs, activeTab }: OrgTabNavProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams();
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="inline-flex h-auto gap-1 rounded-xl bg-secondary/50 p-1 flex-wrap">
      {tabs.map((tab) => {
        const Icon = tabIcons[tab.id];
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-2.5 text-sm transition-all flex items-center",
              isActive
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

