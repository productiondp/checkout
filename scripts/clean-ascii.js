const fs = require('fs');
const path = require('path');

function cleanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanDir(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Remove non-ASCII characters
            const cleaned = content.replace(/[^\x00-\x7F]/g, '');
            if (content !== cleaned) {
                console.log(`Cleaned: ${fullPath}`);
                fs.writeFileSync(fullPath, cleaned);
            }
        }
    }
}

cleanDir(path.join(__dirname, '../src'));
