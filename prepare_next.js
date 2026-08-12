const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const WORKSPACE_DIR = __dirname;
const SIN_PROCESAR_DIR = path.join(WORKSPACE_DIR, 'sin_procesar');
const ESTADO_FILE = path.join(WORKSPACE_DIR, 'estado.json');
const TEMP_IMAGE_PATH = path.join(WORKSPACE_DIR, 'temp_vision.png');

async function prepareNext() {
  if (!fs.existsSync(ESTADO_FILE)) {
    console.error('Error: estado.json no existe.');
    process.exit(1);
  }

  const estado = JSON.parse(fs.readFileSync(ESTADO_FILE, 'utf8'));
  const nextFile = estado.files.find(f => f.status === 'pendiente');

  if (!nextFile) {
    console.log('NO_PENDING_FILES');
    process.exit(0);
  }

  const pdfPath = path.join(SIN_PROCESAR_DIR, nextFile.filename);
  console.log(`PREPARANDO: ${nextFile.filename}`);

  // Limpiar imagen temporal anterior si existe
  if (fs.existsSync(TEMP_IMAGE_PATH)) {
    fs.unlinkSync(TEMP_IMAGE_PATH);
  }

  try {
    const parser = new pdfParse.PDFParse({ url: pdfPath });
    await parser.load();
    
    // Generar captura de la primera página
    const result = await parser.getScreenshot({
      imageBuffer: true,
      desiredWidth: 1200,
      first: 1,
      last: 1
    });

    if (result.pages && result.pages.length > 0) {
      fs.writeFileSync(TEMP_IMAGE_PATH, result.pages[0].data);
      console.log(`SUCCESS: ${nextFile.filename} convertido a temp_vision.png`);
    } else {
      throw new Error('No se generó la página de imagen.');
    }

    await parser.destroy();
  } catch (err) {
    console.error(`ERROR_CONVERTING ${nextFile.filename}:`, err.message);
    
    // Marcar como error en el JSON
    nextFile.status = 'error';
    nextFile.error = err.message;
    fs.writeFileSync(ESTADO_FILE, JSON.stringify(estado, null, 2), 'utf8');
    process.exit(1);
  }
}

prepareNext().catch(console.error);
