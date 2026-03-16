import { NextResponse } from "next/server";
const { createContact } = require("@/lib/queries");

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.name || !data.email || !data.message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        if (process.env.NODE_ENV === "production") {
            return NextResponse.json(
                { success: false, error: "Submissions are disabled in the demo version. Please check back later!" },
                { status: 403 }
            );
        }

        await createContact(data);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
