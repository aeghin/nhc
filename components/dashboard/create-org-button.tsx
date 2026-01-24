"use client";

import { useState } from "react";
import { CreateOrganizationModal } from "../setup/create-organization-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreateOrg() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Organization
      </Button>
      <CreateOrganizationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
