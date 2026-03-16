import { NextResponse } from "next/server";
const { getSchoolById, updateSchool, deleteSchool } = require("@/lib/queries");

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const school = await getSchoolById(parseInt(id));
        if (!school) {
            return NextResponse.json({ error: "School not found" }, { status: 404 });
        }
        return NextResponse.json(school);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    try {
        const data = await request.json();
        await updateSchool(parseInt(id), data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await deleteSchool(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
