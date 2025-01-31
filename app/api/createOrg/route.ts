import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Oranienbaum } from "next/font/google";

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

    return NextResponse.json(organization);

};

