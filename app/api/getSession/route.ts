import { auth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { sessionId } = await auth();

    return NextResponse.json(JSON.stringify({ sessionId }), { status: 200 });
    
};