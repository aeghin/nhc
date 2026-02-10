"use client"

import { useState } from "react"
import { Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvitePersonModal } from "@/components/setup/invite-person-modal";

interface OrganizationActionButtonsProps {
    organizationId: string
}

export function InviteMemberButton({ organizationId }: OrganizationActionButtonsProps) {

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <>
        <Button
          size="sm"
          className="cursor-pointer shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30"
          onClick={() => setInviteModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      <InvitePersonModal open={inviteModalOpen} onOpenChange={setInviteModalOpen} organizationId={organizationId}/>
    </>
  )
}