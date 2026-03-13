import { NextResponse } from "next/server";
const { createSchool } = require("@/lib/queries");

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const text = await file.text();
        const Papa = require("papaparse");
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });

        if (result.errors.length > 0) {
            return NextResponse.json({ error: "CSV parsing error", details: result.errors }, { status: 400 });
        }

        let imported = 0;
        let errors = [];

        for (const row of result.data) {
            try {
                if (!row.school_name || !row.school_type || !row.board || !row.taluk) {
                    errors.push(`Row missing required fields: ${row.school_name || "unknown"}`);
                    continue;
                }
                createSchool({
                    school_name: row.school_name,
                    school_type: row.school_type,
                    board: row.board,
                    udise_code: row.udise_code || "",
                    address: row.address || "",
                    village: row.village || "",
                    taluk: row.taluk,
                    district: row.district || "Kanyakumari",
                    pincode: row.pincode || "",
                    phone: row.phone || "",
                    email: row.email || "",
                    website: row.website || "",
                    classes_available: row.classes_available || "",
                    latitude: parseFloat(row.latitude) || null,
                    longitude: parseFloat(row.longitude) || null,
                    approved: 1,
                    featured: 0,
                });
                imported++;
            } catch (e) {
                errors.push(`Error importing ${row.school_name}: ${e.message}`);
            }
        }

        return NextResponse.json({ success: true, imported, errors });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
