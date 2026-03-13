import { NextResponse } from "next/server";
const { approveSchool } = require("@/lib/queries");

export async function POST(request, { params }) {
    const { id } = await params;
    try {
        approveSchool(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
