const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function run() {
  const pdfPath = path.join(__dirname, 'sin_procesar', 'CUBAMAX-62.pdf');
  const buffer = fs.readFileSync(pdfPath);
  console.log('Cargando buffer de tamaño:', buffer.length);
  
  const parser = new pdfParse.PDFParse({ url: pdfPath });
  console.log('Instanciado parser con url.');
  
  await parser.load();

  console.log('PDF Cargado exitosamente.');
  
  const result = await parser.getText();
  console.log('Result keys:', Object.keys(result));
  const text = result.text || '';
  console.log('Texto extraído (longitud:', text.length, 'caracteres):');
  console.log('=============================================');
  console.log(text.trim().substring(0, 800));
  console.log('=============================================');

  
  await parser.destroy();
}

run().catch(console.error);
