
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

  if (!invitation) return { success: false, error: "Invitation not found", status: "Invalid" }


}