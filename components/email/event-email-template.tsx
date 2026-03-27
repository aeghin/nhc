import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";

interface EventAssignmentEmailProps {
  recipientName: string;
  eventName: string;
  organizationName: string;
  viewLink: string;
}

export default function EventAssignmentEmail({
  recipientName,
  eventName,
  organizationName,
  viewLink,
}: EventAssignmentEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          You&apos;ve been assigned to {eventName} — {organizationName}
        </Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-120 rounded-2xl bg-white shadow-sm overflow-hidden">

            <Section className="bg-linear-to-br from-gray-50 to-gray-100 px-8 pt-10 pb-8 text-center">
              <Section className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-black text-center leading-16">
                <Text className="text-2xl font-bold text-white m-0">N</Text>
              </Section>
              <Text className="text-2xl font-bold tracking-tight text-gray-900 m-0">
                You&apos;re Assigned
              </Text>
              <Text className="mt-2 text-sm text-gray-500 m-0">
                You&apos;ve been assigned to an upcoming event
              </Text>
            </Section>

            <Section className="px-8 py-6 text-center">

              <Text className="text-sm text-gray-600 m-0 mb-6">
                Hi {recipientName}, you&apos;ve been assigned to an event.
              </Text>

              <Section className="rounded-xl border border-gray-200 p-4 mb-4">
                <Text className="text-xs text-gray-500 m-0 mb-1">
                  Event
                </Text>
                <Text className="text-base font-semibold text-gray-900 m-0">
                  {eventName}
                </Text>
              </Section>

              <Section className="rounded-xl border border-gray-200 p-4 mb-6">
                <Text className="text-xs text-gray-500 m-0 mb-1">
                  Organization
                </Text>
                <Text className="text-sm font-medium text-gray-900 m-0">
                  {organizationName}
                </Text>
              </Section>

              <Button
                href={viewLink}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white no-underline"
              >
                View Invitation
              </Button>

            </Section>

            <Section className="border-t border-gray-200 px-8 py-6">
              <Text className="text-center text-xs text-gray-400 m-0">
                If you didn&apos;t expect this assignment, please contact your
                organization admin.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}