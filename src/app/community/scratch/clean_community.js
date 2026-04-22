const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Workstation DP-2', 'DP Clients', 'WEB DEVELOPMENT', 'Checkout', 'src', 'app', 'community', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Replace literal backslash-quote with quote
content = content.replace(/\\"/g, '"');

// Fix the Expert key
content = content.replace('key={Expert-${i}}', 'key={`Expert-${i}`}');

fs.writeFileSync(filePath, content);
console.log("File cleaned successfully.");
