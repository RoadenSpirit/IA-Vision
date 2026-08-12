const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

console.log('pdfParse type:', typeof pdfParse);
console.log('pdfParse keys:', Object.keys(pdfParse || {}));
if (pdfParse && pdfParse.PDFParse) {
  console.log('pdfParse.PDFParse type:', typeof pdfParse.PDFParse);
}

const pdfPath = path.join(__dirname, 'sin_procesar', 'CUBAMAX-62.pdf');

async function inspectPdf() {
  console.log(`Inspeccionando PDF: ${pdfPath}`);
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log('Buffer de PDF cargado, tamaño:', dataBuffer.length, 'bytes');
    
    // Si pdfParse es directamente una función (es el estándar de pdf-parse)
    if (typeof pdfParse === 'function') {
      console.log('Llamando a pdfParse(buffer)...');
      const data = await pdfParse(dataBuffer);
      console.log('Páginas:', data.numpages);
      console.log('Texto extraído (primeros 200 caract.):', data.text ? data.text.trim().substring(0, 200) : 'Ninguno');
    } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
      console.log('Intentando instanciar PDFParse...');
      // A veces la librería instalada es otra (por ejemplo pdf-parse-fork o pdf-parse-plus)
      // que requiere instanciarse o llamarse como constructor
      try {
        const parser = new pdfParse.PDFParse();
        const data = await parser.parse(dataBuffer);
        console.log('Páginas:', data.numpages);
        console.log('Texto extraído:', data.text ? data.text.trim().substring(0, 200) : 'Ninguno');
      } catch (e) {
        console.log('Error instanciando o ejecutando parse:', e.message);
      }
    } else {
      console.log('No se reconoció la estructura de la librería pdf-parse.');
    }
  } catch (err) {
    console.error('Error al abrir o procesar el PDF:', err);
  }
}

inspectPdf();
