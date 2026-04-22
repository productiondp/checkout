const fs = require('fs');
const file = process.argv[2] || '/Users/arundevv/Documents/My Computer/Website/checkout/src/app/home/page.tsx';
const content = fs.readFileSync(file, 'utf8');
let balance = 0;
let parenBalance = 0;
content.split('\n').forEach((line, i) => {
    const open = (line.match(/\{/g) || []).length;
    const close = (line.match(/\}/g) || []).length;
    const pOpen = (line.match(/\(/g) || []).length;
    const pClose = (line.match(/\)/g) || []).length;
    balance += (open - close);
    parenBalance += (pOpen - pClose);
    if (open !== 0 || close !== 0 || pOpen !== 0 || pClose !== 0) {
        console.log(`Line ${i + 1}: B:${balance} P:${parenBalance} | ${line.trim().substring(0, 50)}`);
    }
});
console.log('Final Braces:', balance, 'Final Parens:', parenBalance);
