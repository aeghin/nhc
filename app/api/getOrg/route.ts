import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json('no user found.', { status: 404 });
        };

        const hasOrganization = await db.userOrganization.findMany({
            where: {
                userId
            },
            include: {
                organization: true
            }

        });

        return NextResponse.json(hasOrganization, { status: 200 });


    } catch (err) {
        console.log(err)
    }
};