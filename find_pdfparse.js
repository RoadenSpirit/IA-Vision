const fs = require('fs');
const path = require('path');

const libPath = path.join(__dirname, 'node_modules', 'pdf-parse', 'dist', 'pdf-parse', 'cjs', 'index.cjs');
const content = fs.readFileSync(libPath, 'utf8');

console.log(content.substring(478449, 478449 + 1000));
