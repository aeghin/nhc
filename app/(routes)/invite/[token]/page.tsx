import prisma from "@/lib/prisma";


const InvitePage = async ({ params }: { params: Promise<{ token: string }>}) => {

    const { token } = await params;

    const invitation = await prisma.invitation.findUnique({
        where: {
            token
        }
    });

    if (!invitation) return <h1>Invalid or expired invitation</h1>

    return (
    <h1>I sent you an invite for testing purposes.</h1>
);
};

export default InvitePage;