"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelUserEventAssignment } from "@/lib/actions/event";
import { toast } from "sonner";


import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface EventAssignmentsCardProps {
  assignedUserId: string
  eventId: string
  organizationId: string
};

export const EventVolunteerRowMenu = ({ assignedUserId, eventId, organizationId }: EventAssignmentsCardProps) => {

  const [isPending, startTransition] = useTransition();

  const removeUserAssignment = () => {
    startTransition(async () => {
      const result = await cancelUserEventAssignment(assignedUserId, organizationId, eventId);

      if (result.success) {
        toast.success("Removed from Event", { position: "top-center" });
      } else { 
        toast.error(result.error, { position: "top-center" });
      };
    });
  };
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent"
        >
        <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          ACTION(s)
        </DropdownMenuLabel>
        <DropdownMenuItem disabled={isPending} onClick={removeUserAssignment} className="cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Remove From Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
