const fs = require('fs');
const chatFile = 'src/app/chat/page.tsx';
let c = fs.readFileSync(chatFile, 'utf8');
// Remove Zap import line
c = c.replace('  Zap,\r\n', '');
c = c.replace('  Zap,\n', '');
fs.writeFileSync(chatFile, c);
console.log('Removed Zap import from chat page');
