const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(process.cwd(), "data", "schools.db");

// Singleton client
let client = null;

function getDb() {
  if (client) return client;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Use local file for libsql
  client = createClient({
    url: `file:${DB_PATH}`,
  });

  return client;
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
