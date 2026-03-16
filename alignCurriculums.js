const fs = require('fs');
const { seedSchools } = require('./lib/seed-data.js');

const cbseNames = [
    'SJCS', 'St. Joseph Calasanz', 'BEST', 'LHL', 'N V K S', 'Stella Mary', 'Evans', 
    'Mount Litera', 'Trinity', 'Arokia Annai', 'Packianath', 'Christ Cmi', 'N.m VIDYA', 
    'SMR', 'John\'s Central', 'Annai Chellammal', 'Amrita', 'Adarsh', 'Alphonsa', 
    'Bethany', 'Hildas', 'Kendriya Vidyalaya', 'Public School', 'Central School', 
    'Vidyalayam', 'Academy', 'International School', 'Global School'
];

const matricNames = [
    'Aldrin', 'Anish', 'St. Therasa', 'Vivekanadha', 'Green Park', 'A.P.J.M.', 
    'Pioneer', 'Sri Narayanaguru', 'S.M.R.V.', 'Alphonsa', 'Al Ameen', 'Artesia', 
    'Arumai', 'Arunachala', 'Arunodaya', 'Bethlahem', 'Belfield', 'Don Bosco', 
    'Fatima', 'Friends', 'Good Shepherd', 'John Bonal', 'Joseph\'s Matric', 
    'Orient', 'Ringletaube', 'Rose of Sharon', 'Sacred Heart', 'SGS Memorial',
    'Matriculation', 'Matric.'
];

const icseNames = ['Excel Central', 'ICSE', 'St. Jude'];

let updates = 0;
seedSchools.forEach(school => {
    const name = school.school_name.toUpperCase();
    const oldBoard = school.board;
    
    // Default or cleanup
    if (!school.board || school.board.includes('Schools')) {
        school.board = 'State Board';
    }

    let identified = false;

    // Check for ICSE first
    for (const n of icseNames) {
        if (name.includes(n.toUpperCase())) {
            school.board = 'ICSE';
            identified = true;
            break;
        }
    }

    // Check for CBSE
    if (!identified) {
        for (const n of cbseNames) {
            if (name.includes(n.toUpperCase())) {
                school.board = 'CBSE';
                identified = true;
                break;
            }
        }
    }

    // Check for Matriculation (Matric names often have generic terms, so check specific list first)
    if (!identified) {
        for (const n of matricNames) {
            if (name.includes(n.toUpperCase())) {
                school.board = 'Matriculation';
                identified = true;
                break;
            }
        }
    }

    // Government schools are always State Board
    if (name.includes('GOVERNMENT') || name.includes('GHSS') || name.includes('GHS') || name.includes('GPS') || name.includes('GMS') || name.includes('G.H.S.S.')) {
        school.board = 'State Board';
    }

    if (oldBoard !== school.board) {
        updates++;
    }
});

const content = `const seedSchools = ${JSON.stringify(seedSchools, null, 2)};\n\nmodule.exports = { seedSchools };`;
fs.writeFileSync('lib/seed-data.js', content);
console.log(`Successfully updated ${updates} schools with correct curriculums.`);

// Print some examples
const sample = seedSchools.filter(s => s.board !== 'State Board').slice(0, 10);
console.log('Examples of non-State Board schools:');
sample.forEach(s => console.log(`- ${s.school_name}: ${s.board}`));
