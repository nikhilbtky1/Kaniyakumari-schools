const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.resolve(process.cwd(), "data", "schools.db");

// Singleton client
let client = null;

function getDb() {
  if (client) return client;

  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      console.log(`[DB] Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`[DB] Initializing client with path: ${DB_PATH}`);
    if (!fs.existsSync(DB_PATH)) {
      console.warn(`[DB] Warning: Database file not found at ${DB_PATH}`);
    }

    // Use local file for libsql
    client = createClient({
      url: `file:${DB_PATH}`,
    });

    return client;
  } catch (err) {
    console.error(`[DB] Failed to initialize database:`, err);
    throw err;
  }
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
