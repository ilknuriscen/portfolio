#!/usr/bin/env node

/**
 * Build script for performance optimization
 * - Minifies CSS and JavaScript
 * - Optimizes SVG icons
 * - Generates performance report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CSS minifier
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove whitespace
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        .trim();
}

// Simple JavaScript minifier (basic)
function minifyJS(js) {
    return js
        // Remove single-line comments
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around operators and brackets
        .replace(/\s*([{}()[\];:,=+\-*/<>!&|?])\s*/g, '$1')
        // Restore spaces after keywords
        .replace(/(if|else|for|while|function|return|const|let|var|class|new)\(/g, '$1 (')
        .trim();
}

// Optimize SVG by removing unnecessary attributes
function optimizeSVG(svg) {
    return svg
        // Remove XML declaration
        .replace(/<\?xml[^?]*\?>/g, '')
        // Remove comments
        .replace(/<!--[\s\S]*?-->/g, '')
        // Remove unnecessary whitespace
        .replace(/>\s+</g, '><')
        // Remove default attributes
        .replace(/\s+version="[^"]*"/g, '')
        .replace(/\s+xmlns:xlink="[^"]*"/g, '')
        // Minify numbers (round to 2 decimals)
        .replace(/(\d+\.\d{3,})/g, (match) => parseFloat(match).toFixed(2))
        .trim();
}

// Generate performance report
function generatePerformanceReport(originalSize, minifiedSize, filename) {
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
    const saved = (originalSize - minifiedSize) / 1024;
    
    return {
        filename,
        originalSize: (originalSize / 1024).toFixed(2) + ' KB',
        minifiedSize: (minifiedSize / 1024).toFixed(2) + ' KB',
        reduction: reduction + '%',
        saved: saved.toFixed(2) + ' KB'
    };
}

// Main build process
function build() {
    console.log('🔨 Starting performance optimization build...\n');

    const reports = [];

    // Minify CSS
    try {
        const cssPath = path.join(__dirname, 'style.css');
        const css = fs.readFileSync(cssPath, 'utf8');
        const minifiedCSS = minifyCSS(css);
        
        const minCSSPath = path.join(__dirname, 'style.min.css');
        fs.writeFileSync(minCSSPath, minifiedCSS);
        
        reports.push(generatePerformanceReport(css.length, minifiedCSS.length, 'style.css'));
        console.log('✓ CSS minified: style.min.css');
    } catch (error) {
        console.error('✗ Error minifying CSS:', error.message);
    }

    // Minify JavaScript
    try {
        const jsPath = path.join(__dirname, 'script.js');
        const js = fs.readFileSync(jsPath, 'utf8');
        const minifiedJS = minifyJS(js);
        
        const minJSPath = path.join(__dirname, 'script.min.js');
        fs.writeFileSync(minJSPath, minifiedJS);
        
        reports.push(generatePerformanceReport(js.length, minifiedJS.length, 'script.js'));
        console.log('✓ JavaScript minified: script.min.js');
    } catch (error) {
        console.error('✗ Error minifying JavaScript:', error.message);
    }

    // Generate performance report
    console.log('\n📊 Performance Optimization Report:\n');
    console.table(reports);

    const totalOriginal = reports.reduce((sum, r) => sum + parseFloat(r.originalSize), 0);
    const totalMinified = reports.reduce((sum, r) => sum + parseFloat(r.minifiedSize), 0);
    const totalSaved = totalOriginal - totalMinified;

    console.log(`\n📈 Total Savings: ${totalSaved.toFixed(2)} KB`);
    console.log(`✓ Build complete!\n`);
}

// Run build
build();
