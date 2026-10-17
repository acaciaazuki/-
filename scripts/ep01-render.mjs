// 渲染 Episode 01：videos/ep01/out/ep01_zh.mp4。若 audio/voiceover_zh.wav 存在則混入旁白。
import fs from 'node:fs';
import path from 'node:path';
import {ep, loadScript, remotionArgs, remotionBin, root, run} from './ep01-lib.mjs';

const script = loadScript();
const out = path.join(ep, 'out', 'ep01_zh.mp4');
const voice = path.join(ep, 'audio', 'voiceover_zh.wav');
fs.mkdirSync(path.dirname(out), {recursive: true});

const useAudio = fs.existsSync(voice) && !process.argv.includes('--no-audio');
const publicAudio = path.join(root, 'public', 'audio', 'voiceover_zh-TW.wav');
let copied = false;
if (useAudio) {
  fs.copyFileSync(voice, publicAudio);
  copied = true;
}
try {
  run(remotionBin, ['render', 'src/index.jsx', script.meta.video.composition, out,
    ...(useAudio ? [`--props=${JSON.stringify({audioFile: 'audio/voiceover_zh-TW.wav'})}`] : []),
    ...remotionArgs()]);
} finally {
  if (copied) fs.rmSync(publicAudio, {force: true});
}
console.log(`已產生 ${out}（旁白：${useAudio ? '混入 audio/voiceover_zh.wav' : '無'}）`);
