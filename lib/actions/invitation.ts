"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orgInvitationSchema, OrgInvitationInput } from "../validations/invitations";
import { OrgRole, InvitationStatus } from "@/generated/prisma/enums";

import { Resend } from "resend";
import InvitationEmail from "@/components/email/email-template";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);


    
type ActionResponse =
  | { success: true }
  | { success: false; error: string }

export async function inviteMember(data: OrgInvitationInput): Promise<ActionResponse> {
    
    try {

        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId: userId } 
        });

        if (!user) return { success: false, error: "User not found"};


        const { email, volunteerRoles, orgId } = orgInvitationSchema.parse(data);

        const membership = await prisma.membership.findUnique({
            where: {
                userId_organizationId: { userId: user.id, organizationId: orgId }
            },
            select: { role: true, organization: true }
        }); 

        if (!membership) return { success: false, error: "Not a member" };

        if (membership.role === OrgRole.MEMBER) return { success: false, error: "Insufficient Permissions"};

        const existingMember = await prisma.membership.findFirst({
            where: {
                organizationId: orgId,
                user: { email }
            }
        });
        
        if (existingMember) return { success: false, error: "User is member"};

        const hasInvitation = await prisma.invitation.findUnique({
            where: {
                email_organizationId: {
                    email: email, organizationId: orgId
                } 
            },
        });

        if (hasInvitation?.status === InvitationStatus.ACCEPTED) {
            return { success: false, error: "User has accepted an invitation already"};
        };

        const invitation = await prisma.invitation.upsert({
            where: {
                email_organizationId: {
                    email: email, organizationId: orgId
                } 
            },
            update: { 
                token: crypto.randomUUID(), 
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  
                status: InvitationStatus.PENDING,
                volunteerRoles,
                invitedById: user.id,
            },
            create: {
                email,
                volunteerRoles,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                invitedById: user.id,
                organizationId: orgId,
            }
        });

        await resend.emails.send({
            from: "New Hope Church <no-reply@aeghin.com>",
            to: email,
            subject: `You've been invited to join ${membership.organization.name}`,
            react: InvitationEmail({ 
                organizationName: membership.organization.name,
                invitedByName: user.firstName,
                volunteerRoles: volunteerRoles,
                inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`
            })
        });

        return { success: true };
    } catch (err) {
        return { success: false, error: "Failed to send invitation" };
    };
};
