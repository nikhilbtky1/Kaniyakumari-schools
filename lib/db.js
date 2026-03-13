const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { seedSchools } = require("./seed-data");

const DB_PATH = path.join(process.cwd(), "data", "schools.db");

function getDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      school_name TEXT NOT NULL,
      slug TEXT UNIQUE,
      school_type TEXT NOT NULL,
      board TEXT NOT NULL,
      udise_code TEXT,
      address TEXT,
      village TEXT,
      taluk TEXT NOT NULL,
      district TEXT DEFAULT 'Kanyakumari',
      pincode TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      classes_available TEXT,
      latitude REAL,
      longitude REAL,
      description TEXT DEFAULT '',
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed data if table is empty
  const count = db.prepare("SELECT COUNT(*) as c FROM schools").get();
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO schools (school_name, slug, school_type, board, udise_code, address, village, taluk, district, pincode, phone, email, website, classes_available, latitude, longitude, description, rating, reviews, featured, approved)
      VALUES (@school_name, @slug, @school_type, @board, @udise_code, @address, @village, @taluk, @district, @pincode, @phone, @email, @website, @classes_available, @latitude, @longitude, @description, @rating, @reviews, @featured, @approved)
    `);

    const insertMany = db.transaction((schools) => {
      for (const school of schools) {
        school.slug = generateSlug(school.school_name);
        insert.run(school);
      }
    });

    insertMany(seedSchools);
  }

  return db;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + Math.random().toString(36).substring(2, 6);
}

module.exports = { getDb, generateSlug };
