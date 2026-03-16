import { getDb } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kanyakumarischools.in";

export default async function sitemap() {
    const db = getDb();
    const res = await db.execute("SELECT slug, updated_at FROM schools WHERE approved = 1");
    const schools = res.rows;

    const taluks = ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"];
    const types = ["Government", "Aided"];
    const boards = ["CBSE", "ICSE", "State Board", "Matriculation"];

    // Static pages
    const staticPages = [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
        { url: `${SITE_URL}/schools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE_URL}/map`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/taluk`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/curriculum`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/add-school`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
        { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ];

    // School detail pages
    const schoolPages = schools.map((school) => ({
        url: `${SITE_URL}/schools/${school.slug}`,
        lastModified: new Date(school.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // Taluk pages
    const talukPages = taluks.map((taluk) => ({
        url: `${SITE_URL}/taluk/${encodeURIComponent(taluk)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // Type pages
    const typePages = types.map((type) => ({
        url: `${SITE_URL}/type/${encodeURIComponent(type)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // Board pages
    const boardPages = boards.map((board) => ({
        url: `${SITE_URL}/curriculum/${encodeURIComponent(board)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticPages, ...schoolPages, ...talukPages, ...typePages, ...boardPages];
}
