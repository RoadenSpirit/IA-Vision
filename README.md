# Cubamax — IA Vision

Clasificador automático de facturas de envíos de Cuba (Cubamax). El proyecto lee archivos PDF de facturas, extrae la fecha de cada una mediante visión por IA (Google Gemini) y las organiza automáticamente en carpetas por año y mes.

## Objetivo

Automatizar la clasificación de facturas eliminando el trabajo manual: en lugar de revisar cada PDF a mano, el sistema detecta la fecha impresa en la esquina superior derecha de la factura y la archiva en la ruta correcta.

## Flujo de trabajo

```
[PDFs sin procesar]  →  [Conversión a imagen]  →  [Extracción de fecha con IA]  →  [Organización por año/mes]
```

1. **`setup_workspace.js`** — Mueve los PDFs del directorio raíz a `sin_procesar/` y crea/actualiza `estado.json`.
2. **`prepare_next.js`** — Toma el siguiente PDF en estado `pendiente`, convierte su primera página a imagen `temp_vision.png` (1200px de ancho) y la deja lista para el análisis.
3. **`pilot_vision.js`** — Envía la imagen a Gemini Vision (`gemini-2.5-flash`) con un prompt que pide únicamente la fecha en formato `YYYY-MM-DD` y la devuelve limpia.
4. **`finalize_process.js`** — Mueve el PDF a `procesadas/<AÑO>/<MES>/<YYYY-MM-DD>_<nombre>.pdf`, actualiza el estado y limpia la imagen temporal.

## Requisitos

- Node.js
- Una API Key de [Google Gemini](https://ai.google.dev/) (variable `GEMINI_API_KEY`)

## Instalación

```bash
npm install
cp .env.template .env   # y reemplaza tu API key real
```

## Uso

```bash
# 1. Preparar el workspace (mueve PDFs y crea estado.json)
node setup_workspace.js

# 2. Convertir el siguiente PDF pendiente a imagen
node prepare_next.js

# 3. Extraer la fecha con Gemini Vision
node pilot_vision.js

# 4. Archivar el PDF según la fecha detectada
node finalize_process.js <nombre_archivo> <YYYY-MM-DD>
```

## Estructura

```
cubamax/
├── setup_workspace.js      # Movimiento de PDFs y estado inicial
├── prepare_next.js         # Conversión PDF → imagen
├── pilot_vision.js         # Extracción de fecha con Gemini
├── finalize_process.js     # Archivado y actualización de estado
├── estado.json             # Seguimiento del estado de cada factura
├── sin_procesar/           # PDFs pendientes de clasificar
├── procesadas/             # Facturas archivadas por AÑO/MES
├── .env.template           # Plantilla de configuración
└── node_modules/           # Dependencias
```

## Seguridad

- La API key **nunca** debe aparecer en el repositorio; se carga desde `.env` (ver `.env.template`).
- Las facturas PDF y los archivos `estado.json` están excluidos del control de versiones mediante `.gitignore`.