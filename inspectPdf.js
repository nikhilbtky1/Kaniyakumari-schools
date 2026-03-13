const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('schools.pdf');

pdf(dataBuffer).then(function(data) {
    const text = data.text;
    console.log('PDF Length:', text.length);
    console.log('Sample text:', text.substring(0, 1000));
    
    const matricCount = (text.match(/Matriculation/gi) || []).length;
    const cbseCount = (text.match(/CBSE/gi) || []).length;
    const icseCount = (text.match(/ICSE/gi) || []).length;
    const stateBoardCount = (text.match(/State Board/gi) || []).length;
    
    console.log('Curriculum mentions:');
    console.log('- Matriculation:', matricCount);
    console.log('- CBSE:', cbseCount);
    console.log('- ICSE:', icseCount);
    console.log('- State Board:', stateBoardCount);
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
