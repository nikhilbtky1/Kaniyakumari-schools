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

        createContact(data);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
