const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'onboarding', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use exact content from lines 512-515 (with \r line endings from CRLF)
const oldImg = '                                   <img src={onboardingData.avatar_url || `https://ui-avatars.com/api/?name=${onboardingData.name}&background=f1f5f9&color=64748b&bold=true`} className="w-full h-full object-cover" />\r';

const newImgAndOverlay = `                                   <img src={onboardingData.avatar_url || \`https://ui-avatars.com/api/?name=\${onboardingData.name}&background=f1f5f9&color=64748b&bold=true\`} className="w-full h-full object-cover" alt="Profile preview" />\r
                                   {isUploading && (\r
                                     <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">\r
                                       <Loader2 className="animate-spin text-white" size={28} />\r
                                       <span className="text-[9px] font-black text-white uppercase tracking-widest">Uploading...</span>\r
                                     </div>\r
                                   )}\r`;

const oldBtn = '                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-3 -right-3 h-14 w-14 bg-[#FF3B30] text-white rounded-lg flex items-center justify-center shadow-xl border-4 border-white z-20 hover:scale-110 transition-transform"><Camera size={20} /></button>\r';

const newBtn = `                                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="absolute -bottom-3 -right-3 h-14 w-14 bg-[#FF3B30] text-white rounded-lg flex items-center justify-center shadow-xl border-4 border-white z-20 hover:scale-110 transition-transform disabled:opacity-70 disabled:hover:scale-100">\r
                                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}\r
                                </button>\r`;

if (content.includes(oldImg)) {
  content = content.replace(oldImg, newImgAndOverlay);
  console.log('✅ Image section updated.');
} else {
  console.log('❌ Could not find image line.');
}

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('✅ Button section updated.');
} else {
  console.log('❌ Could not find button line.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File saved.');
