"use client";

import { useState } from "react";
import { CreateOrganizationModal } from "../setup/create-organization-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreateOrg() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button className="cursor-pointer w-full sm:w-auto shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30" onClick={() => setIsModalOpen(true)}>
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
