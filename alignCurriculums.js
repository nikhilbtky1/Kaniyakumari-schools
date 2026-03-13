const fs = require('fs');
const { seedSchools } = require('./lib/seed-data.js');

let updates = 0;
seedSchools.forEach(school => {
    const name = school.school_name.toLowerCase();
    const oldBoard = school.board;
    
    // Default to State Board if not already set or generic
    if (!school.board || school.board === 'High Schools (I-X)' || school.board === 'Primary Schools' || school.board === 'Middle Schools') {
        school.board = 'State Board';
    }

    if (name.includes('matriculation') || name.includes('matric.')) {
        school.board = 'Matriculation';
    } else if (name.includes('cbse') || name.includes('central school') || name.includes('public school') || 
               name.includes('zee school') || name.includes('global school') || name.includes('international school') || 
               name.includes('vidyalayam') || name.includes('academy')) {
        school.board = 'CBSE';
    } else if (name.includes('icse')) {
        school.board = 'ICSE';
    }
    
    if (oldBoard !== school.board) {
        updates++;
    }
});

const content = `const seedSchools = ${JSON.stringify(seedSchools, null, 2)};\n\nmodule.exports = { seedSchools };`;
fs.writeFileSync('lib/seed-data.js', content);
console.log(`Successfully updated ${updates} schools with correct curriculums.`);
