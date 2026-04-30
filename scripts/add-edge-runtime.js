const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app', (filePath) => {
  if (filePath.endsWith('page.tsx') || filePath.endsWith('route.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove any existing runtime export to re-insert it at the top
    content = content.replace(/export const runtime = ['"].*?['"];?\n?/g, '');
    
    if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
        const lines = content.split('\n');
        lines.splice(1, 0, "export const runtime = 'edge';");
        content = lines.join('\n');
    } else {
        content = "export const runtime = 'edge';\n" + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated runtime config in ${filePath}`);
  }
});
