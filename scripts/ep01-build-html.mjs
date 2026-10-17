// 將 videos/ep01/script.json 內嵌進 index.html.tpl，輸出 index.html（可直接 file:// 開啟）。--check 只檢查是否同步。
import fs from 'node:fs';
import path from 'node:path';
import {ep, loadScript} from './ep01-lib.mjs';

const json = JSON.stringify(loadScript()).replace(/</g, '\\u003c');
const html = fs.readFileSync(path.join(ep, 'index.html.tpl'), 'utf8').replace('__SCRIPT_JSON__', () => json);
const target = path.join(ep, 'index.html');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== html) {
    console.error('index.html 與 script.json 不同步，請執行 npm run ep01:html');
    process.exit(1);
  }
  console.log('index.html 已同步');
} else {
  fs.writeFileSync(target, html);
  console.log(`已產生 ${target}`);
}
