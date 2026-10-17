import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ep = path.join(root, 'videos', 'ep01');
export const loadScript = () => JSON.parse(fs.readFileSync(path.join(ep, 'script.json'), 'utf8'));

export const findBrowser = () => {
  const candidates = [process.env.REMOTION_BROWSER, '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'];
  return candidates.find((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
};

export const run = (cmd, args) => {
  const r = spawnSync(cmd, args, {cwd: root, stdio: 'inherit'});
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} 失敗 (exit ${r.status})`);
};

export const remotionArgs = () => {
  const b = findBrowser();
  return b ? [`--browser-executable=${b}`] : [];
};
export const remotionBin = path.join(root, 'node_modules', '.bin', 'remotion');
