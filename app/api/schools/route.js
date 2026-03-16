import { NextResponse } from "next/server";
const { getAllSchools, createSchool, searchSchools } = require("@/lib/queries");

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const params = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "12"),
        sort: searchParams.get("sort") || "name_asc",
        search: searchParams.get("search") || "",
        taluk: searchParams.get("taluk") || "",
        village: searchParams.get("village") || "",
        school_type: searchParams.get("school_type") || "",
        board: searchParams.get("board") || "",
        classes: searchParams.get("classes") || "",
    };

    try {
        const result = await getAllSchools(params);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.school_name || !data.school_type || !data.board || !data.taluk) {
            return NextResponse.json(
                { error: "School name, type, board, and taluk are required" },
                { status: 400 }
            );
        }

        if (process.env.NODE_ENV === "production") {
            return NextResponse.json(
                { success: false, error: "Adding schools is disabled in the demo version. Please check back later!" },
                { status: 403 }
            );
        }

        const result = await createSchool({
            ...data,
            approved: 0,
            featured: 0,
        });

        return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
