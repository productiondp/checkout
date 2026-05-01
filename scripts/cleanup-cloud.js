/**
 * CLEANUP SCRIPT: Remove all Cloudflare and AWS references
 * Run: node scripts/cleanup-cloud.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

let filesModified = 0;
let filesDeleted = 0;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function deleteFile(rel) {
  const full = path.join(ROOT, rel);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true });
    console.log(`🗑  Deleted: ${rel}`);
    filesDeleted++;
  } else {
    console.log(`⚠️  Not found (skip): ${rel}`);
  }
}

function editFile(rel, fn) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) { console.log(`⚠️  File missing: ${rel}`); return; }
  const before = fs.readFileSync(full, 'utf8');
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    console.log(`✏️  Modified: ${rel}`);
    filesModified++;
  } else {
    console.log(`✔  No changes needed: ${rel}`);
  }
}

function removeEdgeRuntime(content) {
  // Remove `export const runtime = 'edge';` line (handles LF and CRLF, with or without newline before/after)
  return content
    .replace(/^export const runtime = 'edge';\r?\n/gm, '')
    .replace(/^export const runtime = "edge";\r?\n/gm, '');
}

// ─── STEP 1: DELETE CLOUDFLARE & AWS FILES ───────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('  STEP 1: Deleting Cloudflare/AWS files');
console.log('═══════════════════════════════════════');

deleteFile('wrangler.toml');
deleteFile('src/backend');                              // AWS Lambda folder
deleteFile('src/services/aws-chat-service.ts');
deleteFile('src/hooks/useAwsChat.ts');
deleteFile('src/components/chat/AwsChatView.tsx');
deleteFile('src/utils/ws-client.ts');                   // AWS WebSocket client (if exists)

// ─── STEP 2: CLEAN package.json ──────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('  STEP 2: Cleaning package.json');
console.log('═══════════════════════════════════════');

editFile('package.json', (content) => {
  const pkg = JSON.parse(content);

  // Remove cloudflare scripts
  delete pkg.scripts['build:cloudflare'];
  delete pkg.scripts['pages:build'];

  // Remove cloudflare devDependency
  if (pkg.devDependencies) {
    delete pkg.devDependencies['@cloudflare/next-on-pages'];
  }

  return JSON.stringify(pkg, null, 2) + '\n';
});

// ─── STEP 3: REMOVE `export const runtime = 'edge'` FROM ALL PAGES & ROUTES ──

console.log('\n═══════════════════════════════════════════════════');
console.log('  STEP 3: Removing edge runtime exports from pages');
console.log('═══════════════════════════════════════════════════');

function walkAndClean(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walkAndClean(full);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const rel = path.relative(ROOT, full);
      editFile(rel, removeEdgeRuntime);
    }
  }
}

walkAndClean(SRC);

// ─── STEP 4: CLEAN CHAT PAGE (remove AWS toggle + import) ──────────────────

console.log('\n═══════════════════════════════════════════════════');
console.log('  STEP 4: Cleaning chat/page.tsx of AWS references');
console.log('═══════════════════════════════════════════════════');

editFile('src/app/chat/page.tsx', (content) => {
  // Remove AwsChatView import
  content = content.replace(/^import \{ AwsChatView \} from "@\/components\/chat\/AwsChatView";\r?\n/gm, '');

  // Remove chatSystem state declaration
  content = content.replace(/^  const \[chatSystem, setChatSystem\] = useState<'SUPABASE' \| 'AWS'>\('SUPABASE'\);\r?\n/gm, '');

  // Remove the AWS guard at top of render: `if (chatSystem === 'AWS') return <AwsChatView ... />;`
  content = content.replace(/^  if \(chatSystem === 'AWS'\) return <AwsChatView userId=\{user\.id\} \/>;\r?\n/gm, '');

  // Remove the AWS toggle button JSX block (multi-line)
  // Pattern: {/* AWS TOGGLE */} ... </button>
  content = content.replace(/\s*\{\/\* AWS TOGGLE \*\/\}[\s\S]*?<\/button>/m, '');

  return content;
});

// ─── DONE ─────────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log(`  ✅ DONE`);
console.log(`  Files modified : ${filesModified}`);
console.log(`  Files deleted  : ${filesDeleted}`);
console.log('═══════════════════════════════════════\n');
console.log('Next steps:');
console.log('  1. Run: npm uninstall @cloudflare/next-on-pages');
console.log('  2. Run: git add -A && git commit -m "cleanup: remove all cloudflare and aws code for vercel deployment"');
console.log('  3. Run: git push\n');
