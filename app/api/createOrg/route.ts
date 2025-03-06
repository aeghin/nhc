import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(req: Request) {

    const { name } = await req.json();
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json('user not found', { status: 404 });
    };

    if (!name) {
        return NextResponse.json('no organization name', { status: 404 });
    };

    const organization = await db.organization.create({
        data: {
            name,
            ownerId: userId
        }
    });

    if (!organization) {
        return NextResponse.json('error creating organization', { status: 404 });
    };

    const userOrg = await db.userOrganization.create({
        data: {
            userId,
            organizationId: organization.id,
            role: Role.OWNER
        }
    });


    if (!userOrg) {
        return NextResponse.json('error creating user organization', { status: 404 });
    };

    return NextResponse.json(userOrg);

};

