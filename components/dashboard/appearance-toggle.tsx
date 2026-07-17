"use client";

import { MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const AppearanceToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="rounded-xl border border-border/40 bg-secondary/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="dark-mode-switch"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <MoonIcon className="size-4 text-primary" />
            Dark mode
          </Label>
          <p className="text-xs text-muted-foreground">
            Switch between light and dark appearance. Applies on this device.
          </p>
        </div>
        <Switch
          size="lg"
          id="dark-mode-switch"
          className="cursor-pointer"
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </div>
    </section>
  );
};
