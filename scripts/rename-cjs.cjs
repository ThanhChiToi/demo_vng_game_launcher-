// package.json khai "type": "module" nên Electron coi file .js trong dist-electron là ESM.
// tsc lại biên dịch main/preload ra CommonJS -> đổi đuôi sang .cjs để Electron nạp đúng.
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'dist-electron');
for (const name of ['main', 'preload']) {
  const from = path.join(outDir, `${name}.js`);
  const to = path.join(outDir, `${name}.cjs`);
  if (fs.existsSync(from)) fs.renameSync(from, to);
}
