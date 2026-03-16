const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "data", "schools.db");
const EXTERNAL_DATA_DIR = path.join(__dirname, "..", "data", "external");

const client = createClient({
    url: `file:${DB_PATH}`,
});

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

async function syncFile(filename, board, schoolType = 'Private') {
    const filePath = path.join(EXTERNAL_DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Syncing ${data.length} schools from ${filename} (${board})...`);

    let added = 0;
    let skipped = 0;

    for (const school of data) {
        const name = school.name || school.Name || school.school_name;
        
        const checkRes = await client.execute({
            sql: `SELECT id FROM schools WHERE school_name = ? AND board = ?`,
            args: [name, board]
        });

        if (checkRes.rows.length > 0) {
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

        await client.execute({
            sql: `INSERT INTO schools (
                school_name, slug, school_type, board, address, 
                taluk, phone, website, approved, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
            args: [
                name,
                generateSlug(name),
                type,
                board,
                school.address || school.Address || '',
                taluk,
                school.phone || school.Phone || '',
                school.website || school.Website || ''
            ]
        });
        added++;
    }

    console.log(`Finished ${filename}: Added ${added}, Skipped ${skipped} duplicates.`);
}

async function run() {
    console.log("Starting school synchronization...");
    try {
        await syncFile('cbse_schools.json', 'CBSE');
        await syncFile('icse_schools.json', 'ICSE');
        await syncFile('pre_primary_schools.json', 'Pre-Primary');
        console.log("Sync complete!");
    } catch (err) {
        console.error("Sync failed:", err);
    } finally {
        client.close();
    }
}

run();
