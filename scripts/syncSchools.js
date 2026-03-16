const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "data", "schools.db");
const EXTERNAL_DATA_DIR = path.join(__dirname, "..", "data", "external");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

const BLOCK_TO_TALUK = {
    'Agastiswaram': 'Agastheeswaram',
    'Agastheeswaram': 'Agastheeswaram',
    'Rajakkamangalam': 'Agastheeswaram',
    'Thovalai': 'Thovalai',
    'Thovala': 'Thovalai',
    'Thackalai': 'Kalkulam',
    'Thackalay': 'Kalkulam',
    'Kurunthancode': 'Kalkulam',
    'Kalkulam': 'Kalkulam',
    'Thiruvattar': 'Thiruvattar',
    'Thiruvattaru': 'Thiruvattar',
    'Killiyoor': 'Killiyoor',
    'Killiyur': 'Killiyoor',
    'Melpuram': 'Vilavancode',
    'Munchira': 'Vilavancode',
    'Munchirai': 'Vilavancode',
    'Vilavancode': 'Vilavancode',
    'Nagercoil': 'Agastheeswaram',
    'Kanyakumari': 'Agastheeswaram',
    'Marthandam': 'Vilavancode',
    'Karungal': 'Vilavancode',
    'Colachel': 'Kalkulam',
    'Kuzhithurai': 'Vilavancode',
    'Padmanabhapuram': 'Kalkulam'
};

function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() + "-" + Math.random().toString(36).substring(2, 6);
}

function normalizeTaluk(val) {
    if (!val) return 'Agastheeswaram';
    const clean = val.replace(/\(TK\)/g, '').trim();
    for (const [key, taluk] of Object.entries(BLOCK_TO_TALUK)) {
        if (clean.toLowerCase().includes(key.toLowerCase())) {
            return taluk;
        }
    }
    return 'Agastheeswaram'; // Default
}

function syncFile(filename, board, schoolType = 'Private') {
    const filePath = path.join(EXTERNAL_DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Syncing ${data.length} schools from ${filename} (${board})...`);

    const insert = db.prepare(`
        INSERT INTO schools (
            school_name, slug, school_type, board, address, 
            taluk, phone, website, approved, featured
        ) VALUES (
            @name, @slug, @type, @board, @address, 
            @taluk, @phone, @website, 1, 0
        )
    `);

    const check = db.prepare(`SELECT id FROM schools WHERE school_name = ? AND board = ?`);

    let added = 0;
    let skipped = 0;

    const transaction = db.transaction((schools) => {
        for (const school of schools) {
            const name = school.name || school.Name || school.school_name;
            const existing = check.get(name, board);
            
            if (existing) {
                skipped++;
                continue;
            }

            const talukRaw = school.taluk || school.taluk_block || school['Taluk/Block'] || '';
            const taluk = normalizeTaluk(talukRaw);
            
            let type = schoolType;
            if (name.toLowerCase().includes('government') || name.toLowerCase().includes('panchayat')) {
                type = 'Government';
            } else if (name.toLowerCase().includes('kendriya vidyalaya')) {
                type = 'Central';
            }

            insert.run({
                name: name,
                slug: generateSlug(name),
                type: type,
                board: board,
                address: school.address || school.Address || '',
                taluk: taluk,
                phone: school.phone || school.Phone || '',
                website: school.website || school.Website || ''
            });
            added++;
        }
    });

    transaction(data);
    console.log(`Finished ${filename}: Added ${added}, Skipped ${skipped} duplicates.`);
}

console.log("Starting school synchronization...");
syncFile('cbse_schools.json', 'CBSE');
syncFile('icse_schools.json', 'ICSE');
syncFile('pre_primary_schools.json', 'Pre-Primary');

console.log("Sync complete!");
db.close();
