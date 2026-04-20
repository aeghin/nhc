import { Users, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembersList } from "@/components/dashboard/members-list";
import prisma from "@/lib/prisma";

interface MembersTabContentProps {
  organizationId: string;
  canManage: boolean;
  userId: string;
}
export const MembersTabContent = async ({
  organizationId,
  canManage,
  userId
}: MembersTabContentProps) => {

  const members = await prisma.membership.findMany({
    where: {
      organizationId,
    },
    select: {
      organizationId: true,
      volunteerRoles: true,
      role: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          userImageUrl: true,
          createdAt: true
        }
      },
    }
  });

  const sorted = [
    ...members.filter((mem) => mem.user.id === userId),
    ...members.filter((mem) => mem.user.id !== userId)
  ];

  
  return (
    <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Team Members
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {members.length} total members
            </p>
          </div>
        </div>
        {canManage && (
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer bg-background/50 transition-all hover:bg-background"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Manage Roles
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {sorted.length === 0 ? (
          <div className="flex h-50 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Users className="h-10 w-10 opacity-20" />
            <p className="text-sm">No members found</p>
          </div>
        ) : (
          <MembersList members={sorted} canManage={canManage} currentUserId={userId}/>
        )}
      </CardContent>
    </Card>
  );
};