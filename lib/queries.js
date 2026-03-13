const { getDb, generateSlug } = require("./db");

function getAllSchools({
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
    let params = {};

    if (search) {
        where.push(
            "(school_name LIKE @search OR village LIKE @search OR taluk LIKE @search)"
        );
        params.search = `%${search}%`;
    }
    if (taluk) {
        where.push("taluk = @taluk");
        params.taluk = taluk;
    }
    if (village) {
        where.push("village = @village");
        params.village = village;
    }
    if (school_type) {
        where.push("school_type = @school_type");
        params.school_type = school_type;
    }
    if (board) {
        where.push("board = @board");
        params.board = board;
    }
    if (classes) {
        where.push("classes_available LIKE @classes");
        params.classes = `%${classes}%`;
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

    const totalStmt = db.prepare(
        `SELECT COUNT(*) as total FROM schools ${whereClause}`
    );
    const { total } = totalStmt.get(params);

    const schoolsStmt = db.prepare(
        `SELECT * FROM schools ${whereClause} ORDER BY ${orderBy} LIMIT @limit OFFSET @offset`
    );
    const schools = schoolsStmt.all({ ...params, limit, offset });

    return {
        schools,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

function getSchoolBySlug(slug) {
    const db = getDb();
    return db.prepare("SELECT * FROM schools WHERE slug = ? AND approved = 1").get(slug);
}

function getSchoolById(id) {
    const db = getDb();
    return db.prepare("SELECT * FROM schools WHERE id = ?").get(id);
}

function getSchoolsByTaluk(taluk) {
    const db = getDb();
    return db
        .prepare(
            "SELECT * FROM schools WHERE taluk = ? AND approved = 1 ORDER BY school_name ASC"
        )
        .all(taluk);
}

function getSchoolsByType(type) {
    const db = getDb();
    return db
        .prepare(
            "SELECT * FROM schools WHERE school_type = ? AND approved = 1 ORDER BY school_name ASC"
        )
        .all(type);
}

function getSchoolsByBoard(board) {
    const db = getDb();
    return db
        .prepare(
            "SELECT * FROM schools WHERE board = ? AND approved = 1 ORDER BY school_name ASC"
        )
        .all(board);
}

function searchSchools(query) {
    const db = getDb();
    const search = `%${query}%`;
    return db
        .prepare(
            `SELECT * FROM schools WHERE approved = 1 AND (school_name LIKE ? OR village LIKE ? OR taluk LIKE ?) ORDER BY school_name ASC LIMIT 20`
        )
        .all(search, search, search);
}

function getNearbySchools(lat, lng, excludeId, limit = 4) {
    const db = getDb();
    return db
        .prepare(
            `SELECT *, 
        ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?)) as dist 
       FROM schools 
       WHERE approved = 1 AND id != ? AND latitude IS NOT NULL AND longitude IS NOT NULL
       ORDER BY dist ASC 
       LIMIT ?`
        )
        .all(lat, lat, lng, lng, excludeId, limit);
}

function getFeaturedSchools(limit = 8) {
    const db = getDb();
    return db
        .prepare(
            "SELECT * FROM schools WHERE featured = 1 AND approved = 1 ORDER BY school_name ASC LIMIT ?"
        )
        .all(limit);
}

function getRecentSchools(limit = 6) {
    const db = getDb();
    return db
        .prepare(
            "SELECT * FROM schools WHERE approved = 1 ORDER BY created_at DESC LIMIT ?"
        )
        .all(limit);
}

function createSchool(data) {
    const db = getDb();
    const slug = generateSlug(data.school_name);
    const stmt = db.prepare(`
    INSERT INTO schools (school_name, slug, school_type, board, udise_code, address, village, taluk, district, pincode, phone, email, website, classes_available, latitude, longitude, description, rating, reviews, featured, approved)
    VALUES (@school_name, @slug, @school_type, @board, @udise_code, @address, @village, @taluk, @district, @pincode, @phone, @email, @website, @classes_available, @latitude, @longitude, @description, @rating, @reviews, @featured, @approved)
  `);
    return stmt.run({
        ...data,
        slug,
        district: data.district || "Kanyakumari",
        description: data.description || "",
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        featured: data.featured || 0,
        approved: data.approved || 0,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
    });
}

function updateSchool(id, data) {
    const db = getDb();
    const slug = generateSlug(data.school_name);
    const stmt = db.prepare(`
    UPDATE schools SET 
      school_name = @school_name, slug = @slug, school_type = @school_type, board = @board,
      udise_code = @udise_code, address = @address, village = @village, taluk = @taluk,
      district = @district, pincode = @pincode, phone = @phone, email = @email,
      website = @website, classes_available = @classes_available,
      latitude = @latitude, longitude = @longitude, description = @description,
      rating = @rating, reviews = @reviews,
      featured = @featured, approved = @approved,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
    return stmt.run({ 
        ...data, 
        id, 
        slug,
        rating: data.rating || 0,
        reviews: data.reviews || 0
    });
}

function deleteSchool(id) {
    const db = getDb();
    return db.prepare("DELETE FROM schools WHERE id = ?").run(id);
}

function approveSchool(id) {
    const db = getDb();
    return db
        .prepare("UPDATE schools SET approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(id);
}

function getStats() {
    const db = getDb();
    const total = db.prepare("SELECT COUNT(*) as c FROM schools WHERE approved = 1").get().c;
    const pending = db.prepare("SELECT COUNT(*) as c FROM schools WHERE approved = 0").get().c;
    const government = db.prepare("SELECT COUNT(*) as c FROM schools WHERE school_type = 'Government' AND approved = 1").get().c;
    const private_ = db.prepare("SELECT COUNT(*) as c FROM schools WHERE school_type = 'Private' AND approved = 1").get().c;
    const aided = db.prepare("SELECT COUNT(*) as c FROM schools WHERE school_type = 'Aided' AND approved = 1").get().c;
    return { total, pending, government, private: private_, aided };
}

function getPendingSchools() {
    const db = getDb();
    return db
        .prepare("SELECT * FROM schools WHERE approved = 0 ORDER BY created_at DESC")
        .all();
}

function getAllSchoolsForMap() {
    const db = getDb();
    return db
        .prepare(
            "SELECT id, school_name, slug, school_type, board, village, taluk, latitude, longitude FROM schools WHERE approved = 1 AND latitude IS NOT NULL AND longitude IS NOT NULL"
        )
        .all();
}

function getDistinctValues(column) {
    const db = getDb();
    return db
        .prepare(`SELECT DISTINCT ${column} FROM schools WHERE approved = 1 ORDER BY ${column} ASC`)
        .all()
        .map((r) => r[column]);
}

function createContact(data) {
    const db = getDb();
    return db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)").run(
        data.name,
        data.email,
        data.message
    );
}

function getAllAdminSchools() {
    const db = getDb();
    return db.prepare("SELECT * FROM schools ORDER BY created_at DESC").all();
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
