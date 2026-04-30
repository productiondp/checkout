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
    if (!content.includes('export const runtime')) {
      content += '\n\nexport const runtime = "edge";\n';
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added runtime config to ${filePath}`);
    }
  }
});
