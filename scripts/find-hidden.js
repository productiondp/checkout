const fs = require('fs');
const path = require('path');

function findHidden(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findHidden(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath);
            for (let i = 0; i < content.length; i++) {
                const char = content[i];
                // Check for non-ASCII or non-printable ASCII (except \n, \r, \t)
                if (char > 127 || (char < 32 && char !== 10 && char !== 13 && char !== 9)) {
                    console.log(`Hidden char ${char} at ${fullPath}:${i}`);
                }
            }
        }
    }
}

findHidden(path.join(__dirname, '../src'));
