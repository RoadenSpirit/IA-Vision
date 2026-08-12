const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const pdfPath = path.join(__dirname, 'sin_procesar', 'CUBAMAX-62.pdf');
const outputPath = path.join(__dirname, 'test_page1.png');

async function test() {
  console.log(`Intentando extraer captura de: ${pdfPath}`);
  try {
    const parser = new pdfParse.PDFParse({ url: pdfPath });
    await parser.load();
    console.log('PDF cargado. Generando captura de la primera página...');
    
    // Obtener captura de la primera página con escala/ancho controlado
    const result = await parser.getScreenshot({
      imageBuffer: true,
      desiredWidth: 1200, // Bajar resolución para ahorrar tokens
      first: 1,           // Solo primera página
      last: 1
    });
    
    if (result.pages && result.pages.length > 0) {
      const pageData = result.pages[0].data;
      fs.writeFileSync(outputPath, pageData);
      console.log(`Conversión exitosa! Guardado en: ${outputPath}`);
      
      const stats = fs.statSync(outputPath);
      console.log(`Dimensiones: ${result.pages[0].width} x ${result.pages[0].height} px`);
      console.log(`Tamaño de la imagen generada: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.error('No se generaron páginas de captura.');
    }
    
    await parser.destroy();
  } catch (err) {
    console.error('Error durante la extracción de captura:', err);
  }
}

test();
