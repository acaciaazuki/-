// 產生 Episode 01 各場景中間畫格與 stills/sheet_zh.png（需 Remotion + ffmpeg）。
import fs from 'node:fs';
import path from 'node:path';
import {ep, loadScript, remotionArgs, remotionBin, run} from './ep01-lib.mjs';

const script = loadScript();
const {fps} = script.meta.video;
const dir = path.join(ep, 'stills');
fs.mkdirSync(dir, {recursive: true});

const files = script.scenes.map((s) => {
  const frame = Math.round(((s.startSec + s.endSec) / 2) * fps);
  const file = path.join(dir, `scene_${s.id}.png`);
  run(remotionBin, ['still', 'src/index.jsx', script.meta.video.composition, file, `--frame=${frame}`, ...remotionArgs()]);
  return file;
});

const inputs = files.flatMap((f) => ['-i', f]);
const cols = 4;
const rows = Math.ceil(files.length / cols);
run('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex',
  `${files.map((_, i) => `[${i}:v]scale=360:640[v${i}]`).join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 640}`).join('|')}[o]`,
  '-map', '[o]', '-frames:v', '1', path.join(dir, 'sheet_zh.png')]);
console.log(`已產生 ${path.join(dir, 'sheet_zh.png')}（${cols}x${rows}）`);
