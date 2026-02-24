"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { orgInvitationSchema, OrgInvitationInput } from "../validations/invitations";
import { OrgRole, InvitationStatus } from "@/generated/prisma/enums";

import { Resend } from "resend";
import InvitationEmail from "@/components/email/email-template";
import { verifyInvitationByToken } from "../services/invitation";

// import twilio from 'twilio';

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID!,
//   process.env.TWILIO_AUTH_TOKEN!
// );

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

type ActionResponse =
  | { success: true; orgId?: string }
  | { success: false; error: string }

export async function inviteMember(data: OrgInvitationInput): Promise<ActionResponse> {
    
    try {

        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId: userId } 
        });

        if (!user) return { success: false, error: "User not found" };


        const { email, volunteerRoles, orgId, phoneNumber } = orgInvitationSchema.parse(data);

        const membership = await prisma.membership.findUnique({
            where: {
                userId_organizationId: { userId: user.id, organizationId: orgId }
            },
            select: { role: true, organization: true }
        }); 

        if (!membership) return { success: false, error: "Not a member" };

        if (membership.role === OrgRole.MEMBER) return { success: false, error: "Insufficient Permissions" };

        const existingMember = await prisma.membership.findFirst({
            where: {
                organizationId: orgId,
                user: { email }
            }
        });
        
        if (existingMember) return { success: false, error: "User is member" };

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
            from: `${membership.organization.name} <no-reply@aeghin.com>`,
            to: email,
            subject: `You've been invited to join ${membership.organization.name}`,
            react: InvitationEmail({ 
                organizationName: membership.organization.name,
                invitedByName: user.firstName,
                volunteerRoles: volunteerRoles,
                inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`
            })
        });

        // await twilioClient.messages.create({
        //      body: `${user.firstName} has invited you to join ${membership.organization.name}! Accept here: ${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`,
        //      from: process.env.TWILIO_PHONE_NUMBER!,
        //      to: `+1${phoneNumber}`,
        //     });

        return { success: true };
    } catch (err) {
        return { success: false, error: "Failed to send invitation" };
    };
};


export async function acceptOrgInvite(token: string): Promise<ActionResponse> {

    try {

        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        });

         if (!user) return { success: false, error: "User not found"};

         const invitation = await verifyInvitationByToken(token);

         if (!invitation) return { success: false, error: "Invalid invitation" };
         
         if (invitation.expiresAt < new Date()) return { success: false, error: "Invitation has expired"};
         
         if (invitation.status !== InvitationStatus.PENDING) return { success: false, error: "This invitation is no longer valid" };
         
         if (user.email !== invitation.email) {
            return { success: false, error: "Incorrect Invitation"}
         };
         
         const acceptedInvitation = await prisma.$transaction(async (trx) => {
            const inv = await trx.invitation.update({
                where: {
                    id: invitation.id,
                },
                data: {
                    status: InvitationStatus.ACCEPTED
                }
            });

            await trx.membership.create({
                data: {
                    volunteerRoles: invitation.volunteerRoles,
                    userId: user.id,
                    organizationId: invitation.organizationId,
                }
            })

            return inv
        
         });

         return { success: true, orgId: acceptedInvitation.organizationId }

    } catch (error) {

        return { success: false, error: "Something went wrong; unable to accept invite" }
    };
};

export async function declineOrgInvite(token: string): Promise<ActionResponse> {

    try {

    const { userId } = await auth();

    if (!userId) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        });

    if (!user) return { success: false, error: "User not found" };

    const invitation = await verifyInvitationByToken(token);
    
    if (!invitation) return { success: false, error: "Invalid invitation" };

    if (invitation.expiresAt < new Date()) return { success: false, error: "Invitation has expired"};

    if (user.email !== invitation.email) return { success: false, error: "Incorrect Invitation"};

    if (invitation.status !== InvitationStatus.PENDING) return { success: false, error: "This invitation is no longer valid" };

    await prisma.invitation.update({
        where: {
            id: invitation.id,
        },
        data: {
            status: InvitationStatus.DECLINED
        }
    });

    return { success: true };

    } catch (error) {

        return { success: false, error: "Unable to decline invitation" };

    };
};

