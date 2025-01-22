import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req) {
    
    const { name } = await req.json();
    const { userId } = await auth();

    const organization = await db.organization.create({
        data: {
            name,
            ownerId: userId,
            members: { connect: }
        }
    })
};

