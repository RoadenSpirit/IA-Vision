const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = __dirname;
const SIN_PROCESAR_DIR = path.join(WORKSPACE_DIR, 'sin_procesar');
const PROCESADAS_DIR = path.join(WORKSPACE_DIR, 'procesadas');
const ESTADO_FILE = path.join(WORKSPACE_DIR, 'estado.json');
const TEMP_IMAGE_PATH = path.join(WORKSPACE_DIR, 'temp_vision.png');

const filename = process.argv[2];
const extractedDate = process.argv[3]; // Formato YYYY-MM-DD

if (!filename || !extractedDate) {
  console.error('Uso: node finalize_process.js <filename> <YYYY-MM-DD>');
  process.exit(1);
}

// Validar formato de fecha
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!dateRegex.test(extractedDate)) {
  console.error('Error: La fecha debe tener el formato YYYY-MM-DD.');
  process.exit(1);
}

async function finalize() {
  try {
    const estado = JSON.parse(fs.readFileSync(ESTADO_FILE, 'utf8'));
    const fileEntry = estado.files.find(f => f.filename === filename);

    if (!fileEntry) {
      console.error(`Error: No se encontró la entrada para "${filename}" en estado.json`);
      process.exit(1);
    }

    // Extraer año y mes para crear las carpetas
    const [year, month] = extractedDate.split('-');
    const targetDir = path.join(PROCESADAS_DIR, year, month);

    // Crear carpetas Año/Mes si no existen
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`Creado directorio de destino: procesadas/${year}/${month}`);
    }

    const oldPath = path.join(SIN_PROCESAR_DIR, filename);
    // Nuevo nombre: YYYY-MM-DD_NombreOriginal.pdf
    const newFilename = `${extractedDate}_${filename}`;
    const newPath = path.join(targetDir, newFilename);

    // Mover archivo
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Movido: "${filename}" -> "procesadas/${year}/${month}/${newFilename}"`);
    } else {
      throw new Error('El archivo PDF original no se encontró en sin_procesar.');
    }

    // Actualizar estado.json
    fileEntry.status = 'procesado';
    fileEntry.processed_at = new Date().toISOString();
    fileEntry.extracted_date = extractedDate;
    fileEntry.destination_path = path.relative(WORKSPACE_DIR, newPath);
    fileEntry.error = null;

    fs.writeFileSync(ESTADO_FILE, JSON.stringify(estado, null, 2), 'utf8');
    console.log('estado.json actualizado.');

    // Limpiar imagen temporal
    if (fs.existsSync(TEMP_IMAGE_PATH)) {
      fs.unlinkSync(TEMP_IMAGE_PATH);
      console.log('Imagen temporal temp_vision.png eliminada.');
    }

    console.log('SUCCESS: Proceso finalizado correctamente.');
  } catch (err) {
    console.error('Error al finalizar el procesamiento:', err);
    process.exit(1);
  }
}

finalize();
