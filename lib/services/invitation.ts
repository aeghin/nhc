import "server-only"

import prisma from "../prisma";

export const verifyInvitationByToken = async (token: string) => {

    const invitation = await prisma.invitation.findUnique({
    where: {
      token,
    },
    include: {
      organization: true,
      invitedBy: true,
    },
  });

  if (!invitation) return null

  return invitation;

};