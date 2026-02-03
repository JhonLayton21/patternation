/**
 * Ejemplo simplificado usando el orquestador del core
 * 
 * Este ejemplo demuestra cómo usar generatePatternSVG
 * para generar patrones SVG con una sola llamada.
 */

import { generatePatternSVG } from './domain/core/patternOrchestrator';

console.log('=== Ejemplo con Orquestador del Core ===\n');

// Ejemplo 1: Uso básico
console.log('Ejemplo 1: Uso básico con defaults\n');

const svg1 = generatePatternSVG({
    type: 'grid',
    config: {},
});

console.log(`SVG generado (${svg1.length} caracteres)`);
console.log('Primeras 200 caracteres:');
console.log(svg1.substring(0, 200) + '...\n');

// Ejemplo 2: Configuración personalizada
console.log('Ejemplo 2: Grid personalizado con fondo\n');

const svg2 = generatePatternSVG({
    type: 'grid',
    config: {
        cellSize: 30,
        gap: 5,
        strokeColor: '#FF5733',
        strokeWidth: 2,
        width: 400,
        height: 300,
    },
    renderOptions: {
        backgroundColor: '#F0F0F0',
    },
});

console.log(`SVG con fondo generado (${svg2.length} caracteres)\n`);

// Ejemplo 3: Grid compacto
console.log('Ejemplo 3: Grid compacto para íconos\n');

const svg3 = generatePatternSVG({
    type: 'grid',
    config: {
        cellSize: 10,
        gap: 2,
        strokeColor: '#0066CC',
        strokeWidth: 1,
        width: 100,
        height: 100,
    },
});

console.log(`Grid compacto generado (${svg3.length} caracteres)\n`);

// Ejemplo 4: SVG completo para visualizar
console.log('Ejemplo 4: SVG completo (pequeño)\n');

const svg4 = generatePatternSVG({
    type: 'grid',
    config: {
        cellSize: 40,
        gap: 10,
        strokeColor: '#333333',
        strokeWidth: 2,
        width: 150,
        height: 150,
    },
    renderOptions: {
        backgroundColor: '#FFFFFF',
    },
});

console.log(svg4);
console.log('\n');

// Ejemplo 5: Manejo de errores
console.log('Ejemplo 5: Manejo de errores\n');

try {
    generatePatternSVG({
        type: 'dots',
        config: {},
    });
} catch (error) {
    console.log('Error capturado:', (error as Error).message);
}

console.log('\n=== Fin de Ejemplos ===');

// Casos de uso reales
console.log('\n=== Casos de Uso Reales ===\n');

console.log('1. Guardar como archivo .svg:');
console.log('   fs.writeFileSync("pattern.svg", svg);\n');

console.log('2. Usar en HTML:');
console.log('   <img src="data:image/svg+xml;base64,..." />\n');

console.log('3. Usar como background CSS:');
console.log('   background-image: url("data:image/svg+xml,...");\n');

console.log('4. Convertir a PNG/JPEG (con librería externa):');
console.log('   sharp(Buffer.from(svg)).png().toFile("pattern.png");\n');
