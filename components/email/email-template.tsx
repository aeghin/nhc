import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

import { volunteerRoleConfig } from "@/lib/config/roles";
import { VolunteerRole } from "@/generated/prisma/enums";

interface InvitationEmailProps {
  organizationName: string;
  invitedByName: string;
  volunteerRoles: VolunteerRole[];
  inviteLink: string;
  expiresInDays?: number;
};

export default function InvitationEmail({
  organizationName,
  invitedByName,
  volunteerRoles,
  inviteLink,
  expiresInDays = 7,
}: InvitationEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>You've been invited to join {organizationName}</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-120 rounded-xl bg-white p-8 shadow-sm">
            
            
            <Section className="text-center">
              <Text className="text-2xl font-bold text-gray-900">
                You're Invited!
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                {invitedByName} has invited you to join
              </Text>
              <Text className="mt-1 text-lg font-semibold text-gray-900">
                {organizationName}
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            
            <Section className="text-center">
              <Text className="text-sm font-medium text-gray-700">
                You've been assigned the following role{volunteerRoles.length > 1 ? "s" : ""}:
              </Text>
              <Section className="mt-2 rounded-lg bg-gray-50 p-4">
                {volunteerRoles.map((role) => {
                  const { label, icon } = volunteerRoleConfig[role];
                  return (
                    <Text key={label} className="my-1 text-sm text-gray-800">
                    • {label} {icon}
                  </Text>
                  )
                })}
              </Section>
            </Section>

            
            <Section className="mt-8 text-center">
              <Button
                href={inviteLink}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white no-underline"
              >
                Accept Invitation
              </Button>
            </Section>

            
            <Text className="mt-6 text-center text-xs text-gray-400">
              This invitation expires in {expiresInDays} days.
            </Text>

            <Hr className="my-6 border-gray-200" />

            
            <Text className="text-center text-xs text-gray-400">
              If you didn't expect this invitation, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}