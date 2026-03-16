const { getDb, generateSlug } = require("./db");

async function getAllSchools({
    page = 1,
    limit = 12,
    sort = "name_asc",
    search = "",
    taluk = "",
    village = "",
    school_type = "",
    board = "",
    classes = "",
} = {}) {
    const db = getDb();
    let where = ["approved = 1"];
    let args = [];

    if (search) {
        where.push(
            "(school_name LIKE ? OR village LIKE ? OR taluk LIKE ?)"
        );
        const s = `%${search}%`;
        args.push(s, s, s);
    }
    if (taluk) {
        where.push("taluk = ?");
        args.push(taluk);
    }
    if (village) {
        where.push("village = ?");
        args.push(village);
    }
    if (school_type) {
        where.push("school_type = ?");
        args.push(school_type);
    }
    if (board) {
        where.push("board = ?");
        args.push(board);
    }
    if (classes) {
        where.push("classes_available LIKE ?");
        args.push(`%${classes}%`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    let orderBy = "school_name ASC";
    switch (sort) {
        case "name_desc":
            orderBy = "school_name DESC";
            break;
        case "recent":
            orderBy = "created_at DESC";
            break;
        case "oldest":
            orderBy = "created_at ASC";
            break;
        default:
            orderBy = "school_name ASC";
    }

    const offset = (page - 1) * limit;

    try {
        const totalRes = await db.execute({
            sql: `SELECT COUNT(*) as total FROM schools ${whereClause}`,
            args: args
        });
        const total = totalRes.rows[0].total;

        const schoolsRes = await db.execute({
            sql: `SELECT * FROM schools ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            args: [...args, limit, offset]
        });
        const schools = schoolsRes.rows;

        return {
            schools,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (err) {
        console.error("[Queries] Error in getAllSchools:", err);
        return {
            schools: [],
            total: 0,
            page,
            totalPages: 0,
        };
    }
}

async function getSchoolBySlug(slug) {
    const db = getDb();
    try {
        const res = await db.execute({
            sql: "SELECT * FROM schools WHERE slug = ? AND approved = 1",
            args: [slug]
        });
        return res.rows[0];
    } catch (err) {
        console.error(`[Queries] Error in getSchoolBySlug(${slug}):`, err);
        return null;
    }
}

async function getSchoolById(id) {
    const db = getDb();
    const res = await db.execute({
        sql: "SELECT * FROM schools WHERE id = ?",
        args: [id]
    });
    return res.rows[0];
}

async function getSchoolsByTaluk(taluk) {
    const db = getDb();
    const res = await db.execute({
        sql: "SELECT * FROM schools WHERE taluk = ? AND approved = 1 ORDER BY school_name ASC",
        args: [taluk]
    });
    return res.rows;
}

async function getSchoolsByType(type) {
    const db = getDb();
    const res = await db.execute({
        sql: "SELECT * FROM schools WHERE school_type = ? AND approved = 1 ORDER BY school_name ASC",
        args: [type]
    });
    return res.rows;
}

async function getSchoolsByBoard(board) {
    const db = getDb();
    const res = await db.execute({
        sql: "SELECT * FROM schools WHERE board = ? AND approved = 1 ORDER BY school_name ASC",
        args: [board]
    });
    return res.rows;
}

async function searchSchools(query) {
    const db = getDb();
    const search = `%${query}%`;
    const res = await db.execute({
        sql: `SELECT * FROM schools WHERE approved = 1 AND (school_name LIKE ? OR village LIKE ? OR taluk LIKE ?) ORDER BY school_name ASC LIMIT 20`,
        args: [search, search, search]
    });
    return res.rows;
}

async function getNearbySchools(lat, lng, excludeId, limit = 4) {
    const db = getDb();
    const res = await db.execute({
        sql: `SELECT *, 
        ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?)) as dist 
       FROM schools 
       WHERE approved = 1 AND id != ? AND latitude IS NOT NULL AND longitude IS NOT NULL
       ORDER BY dist ASC 
       LIMIT ?`,
        args: [lat, lat, lng, lng, excludeId, limit]
    });
    return res.rows;
}

async function getFeaturedSchools(limit = 8) {
    const db = getDb();
    try {
        const res = await db.execute({
            sql: "SELECT * FROM schools WHERE featured = 1 AND approved = 1 ORDER BY school_name ASC LIMIT ?",
            args: [limit]
        });
        return res.rows;
    } catch (err) {
        console.error(`[Queries] Error in getFeaturedSchools:`, err);
        return [];
    }
}

async function getRecentSchools(limit = 6) {
    const db = getDb();
    try {
        const res = await db.execute({
            sql: "SELECT * FROM schools WHERE approved = 1 ORDER BY created_at DESC LIMIT ?",
            args: [limit]
        });
        return res.rows;
    } catch (err) {
        console.error(`[Queries] Error in getRecentSchools:`, err);
        return [];
    }
}

async function createSchool(data) {
    const db = getDb();
    const slug = generateSlug(data.school_name);
    
    // Check if in production read-only mode (managed by caller or db initialization)
    // Libsql might throw if local file is read-only.
    
    const sql = `
    INSERT INTO schools (school_name, slug, school_type, board, udise_code, address, village, taluk, district, pincode, phone, email, website, classes_available, latitude, longitude, description, rating, reviews, featured, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const args = [
        data.school_name,
        slug,
        data.school_type,
        data.board,
        data.udise_code || null,
        data.address || null,
        data.village || null,
        data.taluk,
        data.district || "Kanyakumari",
        data.pincode || null,
        data.phone || null,
        data.email || null,
        data.website || null,
        data.classes_available || null,
        data.latitude || null,
        data.longitude || null,
        data.description || "",
        data.rating || 0,
        data.reviews || 0,
        data.featured || 0,
        data.approved || 0
    ];

    return await db.execute({ sql, args });
}

async function updateSchool(id, data) {
    const db = getDb();
    const slug = generateSlug(data.school_name);
    const sql = `
    UPDATE schools SET 
      school_name = ?, slug = ?, school_type = ?, board = ?,
      udise_code = ?, address = ?, village = ?, taluk = ?,
      district = ?, pincode = ?, phone = ?, email = ?,
      website = ?, classes_available = ?,
      latitude = ?, longitude = ?, description = ?,
      rating = ?, reviews = ?,
      featured = ?, approved = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `;
    
    const args = [
        data.school_name,
        slug,
        data.school_type,
        data.board,
        data.udise_code || null,
        data.address || null,
        data.village || null,
        data.taluk,
        data.district || "Kanyakumari",
        data.pincode || null,
        data.phone || null,
        data.email || null,
        data.website || null,
        data.classes_available || null,
        data.latitude || null,
        data.longitude || null,
        data.description || "",
        data.rating || 0,
        data.reviews || 0,
        data.featured || 0,
        data.approved || 0,
        id
    ];

    return await db.execute({ sql, args });
}

async function deleteSchool(id) {
    const db = getDb();
    return await db.execute({
        sql: "DELETE FROM schools WHERE id = ?",
        args: [id]
    });
}

async function approveSchool(id) {
    const db = getDb();
    return await db.execute({
        sql: "UPDATE schools SET approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [id]
    });
}

async function getStats() {
    const db = getDb();
    try {
        const total = (await db.execute("SELECT COUNT(*) as c FROM schools WHERE approved = 1")).rows[0].c;
        const pending = (await db.execute("SELECT COUNT(*) as c FROM schools WHERE approved = 0")).rows[0].c;
        const government = (await db.execute("SELECT COUNT(*) as c FROM schools WHERE school_type = 'Government' AND approved = 1")).rows[0].c;
        const private_ = (await db.execute("SELECT COUNT(*) as c FROM schools WHERE school_type = 'Private' AND approved = 1")).rows[0].c;
        const aided = (await db.execute("SELECT COUNT(*) as c FROM schools WHERE school_type = 'Aided' AND approved = 1")).rows[0].c;
        return { total, pending, government, private: private_, aided };
    } catch (err) {
        console.error("[Queries] Error in getStats:", err);
        return { total: 0, pending: 0, government: 0, private: 0, aided: 0 };
    }
}

async function getPendingSchools() {
    const db = getDb();
    const res = await db.execute("SELECT * FROM schools WHERE approved = 0 ORDER BY created_at DESC");
    return res.rows;
}

async function getAllSchoolsForMap() {
    const db = getDb();
    const res = await db.execute("SELECT id, school_name, slug, school_type, board, village, taluk, latitude, longitude FROM schools WHERE approved = 1 AND latitude IS NOT NULL AND longitude IS NOT NULL");
    return res.rows;
}

async function getDistinctValues(column) {
    const db = getDb();
    const res = await db.execute(`SELECT DISTINCT ${column} FROM schools WHERE approved = 1 ORDER BY ${column} ASC`);
    return res.rows.map((r) => r[column]);
}

async function createContact(data) {
    const db = getDb();
    return await db.execute({
        sql: "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        args: [data.name, data.email, data.message]
    });
}

async function getAllAdminSchools() {
    const db = getDb();
    const res = await db.execute("SELECT * FROM schools ORDER BY created_at DESC");
    return res.rows;
}

module.exports = {
    getAllSchools,
    getSchoolBySlug,
    getSchoolById,
    getSchoolsByTaluk,
    getSchoolsByType,
    getSchoolsByBoard,
    searchSchools,
    getNearbySchools,
    getFeaturedSchools,
    getRecentSchools,
    createSchool,
    updateSchool,
    deleteSchool,
    approveSchool,
    getStats,
    getPendingSchools,
    getAllSchoolsForMap,
    getDistinctValues,
    createContact,
    getAllAdminSchools,
};
