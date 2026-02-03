/**
 * Ejemplo de integración: Generador Grid + Renderer SVG
 * 
 * Este ejemplo demuestra cómo usar el generador de patrones
 * junto con el renderer SVG para crear un patrón completo.
 */

import { generateGridPattern } from './domain/pattern/generators/gridPattern';
import { renderToSVG } from './domain/renderer/svgRenderer';

// Ejemplo 1: Grid pattern básico con defaults
console.log('=== Ejemplo 1: Grid Pattern Básico ===\n');

const basicPattern = generateGridPattern({});
const basicSVG = renderToSVG(basicPattern);

console.log('Patrón generado:');
console.log(`- Elementos: ${basicPattern.elements.length}`);
console.log(`- Dimensiones: ${basicPattern.dimensions.width}x${basicPattern.dimensions.height}`);
console.log('\nSVG generado (primeras 200 caracteres):');
console.log(basicSVG.substring(0, 200) + '...\n');

// Ejemplo 2: Grid pattern personalizado
console.log('=== Ejemplo 2: Grid Pattern Personalizado ===\n');

const customPattern = generateGridPattern({
    cellSize: 30,
    gap: 5,
    strokeColor: '#FF5733',
    strokeWidth: 2,
    width: 400,
    height: 300,
});

const customSVG = renderToSVG(customPattern, {
    backgroundColor: '#F0F0F0',
});

console.log('Patrón personalizado:');
console.log(`- Elementos: ${customPattern.elements.length}`);
console.log(`- Cell size: 30px`);
console.log(`- Gap: 5px`);
console.log(`- Color: #FF5733`);
console.log(`- Dimensiones: ${customPattern.dimensions.width}x${customPattern.dimensions.height}`);
console.log('\nSVG con fondo (primeras 300 caracteres):');
console.log(customSVG.substring(0, 300) + '...\n');

// Ejemplo 3: Grid compacto
console.log('=== Ejemplo 3: Grid Compacto ===\n');

const compactPattern = generateGridPattern({
    cellSize: 10,
    gap: 2,
    strokeColor: '#0066CC',
    strokeWidth: 1,
    width: 200,
    height: 200,
});

const compactSVG = renderToSVG(compactPattern);

console.log('Grid compacto:');
console.log(`- Elementos: ${compactPattern.elements.length}`);
console.log(`- Tamaño SVG: ${compactSVG.length} caracteres`);

// Ejemplo 4: Guardar SVG a archivo (simulado)
console.log('\n=== Ejemplo 4: Exportación ===\n');

const exportPattern = generateGridPattern({
    cellSize: 25,
    gap: 0,
    strokeColor: '#000000',
    strokeWidth: 1,
    width: 500,
    height: 500,
});

const exportSVG = renderToSVG(exportPattern);

console.log('SVG listo para exportar:');
console.log(`- Tamaño: ${exportSVG.length} caracteres`);
console.log('- Puede guardarse como .svg');
console.log('- Puede usarse en <img> o como background');
console.log('- Puede convertirse a PNG/JPEG si es necesario\n');

// Mostrar SVG completo de un ejemplo pequeño
console.log('=== SVG Completo (Ejemplo Pequeño) ===\n');

const smallPattern = generateGridPattern({
    cellSize: 40,
    gap: 10,
    strokeColor: '#333333',
    strokeWidth: 2,
    width: 150,
    height: 150,
});

const smallSVG = renderToSVG(smallPattern, {
    backgroundColor: '#FFFFFF',
});

console.log(smallSVG);
console.log('\n=== Fin de Ejemplos ===');
