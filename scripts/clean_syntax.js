const fs = require('fs');
const filePath = 'd:\\Workstation DP-2\\DP Clients\\WEB DEVELOPMENT\\Checkout\\src\\app\\home\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Aggressively clean up whitespace around the return statement
content = content.replace(/return\s*\(\s*<div/g, 'return (\n    <div');

fs.writeFileSync(filePath, content);
console.log('Cleaned return statement.');
