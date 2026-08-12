const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Cargar API key desde .env si existe

const { GoogleGenAI } = require('@google/genai');

// Inicializar la API de Gemini
// Si no se le pasa apiKey, el SDK de @google/genai busca automáticamente process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('ADVERTENCIA: process.env.GEMINI_API_KEY no está definida. Si falla la llamada, por favor crea un archivo .env o define la variable.');
}

const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

const imagePath = path.join(__dirname, 'test_page1.png');

async function runPilot() {
  console.log(`Cargando imagen: ${imagePath}`);
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: No existe la imagen de prueba en ${imagePath}. Ejecuta primero test_pdf_to_img.js`);
    return;
  }
  
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  console.log('Enviando imagen a Gemini Vision (gemini-2.5-flash)...');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png'
          }
        },
        'Analiza esta imagen de factura de envío de Cuba. Extrae la fecha de la factura, la cual siempre se encuentra en la esquina superior derecha. ' +
        'Debes devolver ÚNICAMENTE la fecha en formato YYYY-MM-DD (por ejemplo: 2026-05-21). ' +
        'No respondas con texto adicional, no uses markdown ni comillas, solo la fecha en el formato indicado.'
      ]
    });
    
    console.log('\n--- RESPUESTA DE GEMINI ---');
    console.log(`Respuesta cruda: "${response.text}"`);
    const cleanDate = response.text ? response.text.trim() : '';
    console.log(`Fecha limpia extraída: "${cleanDate}"`);
    
    // Validar formato de fecha YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(cleanDate)) {
      console.log('✅ Formato de fecha VÁLIDO y correcto!');
    } else {
      console.log('❌ Formato de fecha INVÁLIDO. Necesitamos que responda exactamente en formato YYYY-MM-DD.');
    }
  } catch (err) {
    console.error('Error durante la llamada a Gemini API:', err);
  }
}

runPilot();
