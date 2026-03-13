import { NextResponse } from "next/server";
const { getStats } = require("@/lib/queries");

export async function GET() {
    try {
        const stats = getStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
