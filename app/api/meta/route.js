import { NextResponse } from "next/server";
const { getDistinctValues } = require("@/lib/queries");

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const column = searchParams.get("column");

    if (!column) {
        return NextResponse.json({ error: "Column parameter is required" }, { status: 400 });
    }

    const allowedColumns = ["village", "taluk", "school_type", "board"];
    if (!allowedColumns.includes(column)) {
        return NextResponse.json({ error: "Invalid column parameter" }, { status: 400 });
    }

    try {
        const values = getDistinctValues(column);
        // Filter out null or empty values
        const filteredValues = values.filter(v => v && v.trim() !== "");
        return NextResponse.json(filteredValues);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
