const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = __dirname;
const SIN_PROCESAR_DIR = path.join(WORKSPACE_DIR, 'sin_procesar');
const PROCESADAS_DIR = path.join(WORKSPACE_DIR, 'procesadas');
const ESTADO_FILE = path.join(WORKSPACE_DIR, 'estado.json');

// 1. Crear carpetas necesarias
if (!fs.existsSync(SIN_PROCESAR_DIR)) {
  fs.mkdirSync(SIN_PROCESAR_DIR);
  console.log('Creada carpeta: sin_procesar');
}
if (!fs.existsSync(PROCESADAS_DIR)) {
  fs.mkdirSync(PROCESADAS_DIR);
  console.log('Creada carpeta: procesadas');
}

// 2. Escanear archivos en el directorio raíz
const items = fs.readdirSync(WORKSPACE_DIR);
const pdfFiles = items.filter(item => {
  const ext = path.extname(item).toLowerCase();
  const fullPath = path.join(WORKSPACE_DIR, item);
  return fs.statSync(fullPath).isFile() && ext === '.pdf';
});

console.log(`Encontrados ${pdfFiles.length} archivos PDF para mover.`);

// 3. Crear el JSON de estado inicial
let estado = { files: [] };
if (fs.existsSync(ESTADO_FILE)) {
  try {
    estado = JSON.parse(fs.readFileSync(ESTADO_FILE, 'utf8'));
    console.log('Cargado estado.json existente.');
  } catch (e) {
    console.error('Error leyendo estado.json, se creará uno nuevo:', e);
  }
}

// 4. Mover archivos y actualizar estado
pdfFiles.forEach(file => {
  const oldPath = path.join(WORKSPACE_DIR, file);
  const newPath = path.join(SIN_PROCESAR_DIR, file);

  // Mover archivo
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Movido: "${file}" -> sin_procesar`);

    // Añadir al estado si no existe ya
    const existeEnEstado = estado.files.some(f => f.filename === file);
    if (!existeEnEstado) {
      estado.files.push({
        filename: file,
        status: 'pendiente',
        processed_at: null,
        error: null,
        extracted_date: null,
        destination_path: null
      });
    }
  } catch (err) {
    console.error(`Error moviendo "${file}":`, err);
  }
});

// 5. Guardar estado.json
fs.writeFileSync(ESTADO_FILE, JSON.stringify(estado, null, 2), 'utf8');
console.log('Guardado estado.json actualizado con éxito.');
