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
    
    // 1. Remove all existing runtime exports
    content = content.replace(/export const runtime = ['"].*?['"];?\n?/g, '');
    
    // 2. Check for "use client" anywhere in the file
    const hasClientDirective = /['"]use client['"];?/.test(content);
    
    if (hasClientDirective) {
        // 3. Remove all occurrences of "use client"
        content = content.replace(/['"]use client['"];?\n?/g, '');
        // 4. Prepend it correctly at the very top
        content = `"use client";\nexport const runtime = 'edge';\n` + content.trimStart();
    } else {
        // 5. No "use client", just prepend runtime at the top
        content = `export const runtime = 'edge';\n` + content.trimStart();
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Hard-fixed runtime and client directive in ${filePath}`);
  }
});
