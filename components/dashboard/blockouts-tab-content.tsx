import { BlockoutsManager } from "@/components/dashboard/blockouts-manager";
import { getUserBlockouts } from "@/lib/services/blockouts";

interface BlockoutsTabContentProps {
  organizationId: string;
  userId: string;
}

export const BlockoutsTabContent = async ({
  organizationId,
  userId,
}: BlockoutsTabContentProps) => {
  const blockouts = await getUserBlockouts(userId, organizationId);

  return (
    <BlockoutsManager organizationId={organizationId} blockouts={blockouts} />
  );
};
