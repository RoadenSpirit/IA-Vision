const keys = Object.keys(process.env);
console.log('Teclas de process.env encontradas:', keys.filter(k => k.toLowerCase().includes('api') || k.toLowerCase().includes('gemini') || k.toLowerCase().includes('google') || k.toLowerCase().includes('key')));
console.log('Todas las claves disponibles:', keys.join(', '));
