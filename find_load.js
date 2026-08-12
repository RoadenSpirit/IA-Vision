const fs = require('fs');
const path = require('path');

const libPath = path.join(__dirname, 'node_modules', 'pdf-parse', 'dist', 'pdf-parse', 'cjs', 'index.cjs');
const content = fs.readFileSync(libPath, 'utf8');

console.log('Longitud de index.cjs:', content.length);

// Busquemos "load(" o similar en el código
const index = content.indexOf('load(');
if (index !== -1) {
  console.log('Encontrado "load(" en posición:', index);
  console.log(content.substring(index - 100, index + 300));
} else {
  console.log('No se encontró "load("');
}

// Busquemos "load:"
const indexColon = content.indexOf('load:');
if (indexColon !== -1) {
  console.log('Encontrado "load:" en posición:', indexColon);
  console.log(content.substring(indexColon - 100, indexColon + 300));
}

// Busquemos "load "
const indexSpace = content.indexOf('load ');
if (indexSpace !== -1) {
  console.log('Encontrado "load " en posición:', indexSpace);
  console.log(content.substring(indexSpace - 100, indexSpace + 300));
}
