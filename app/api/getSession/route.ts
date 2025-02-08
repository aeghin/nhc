import { auth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { sessionId } = await auth();

    if (!sessionId) {
     return NextResponse.json("session not found", {status: 401 });
};

    return NextResponse.json(JSON.stringify({ sessionId }), { status: 200 });
    
};