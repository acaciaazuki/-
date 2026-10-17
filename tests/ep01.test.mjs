import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ep, loadScript, root} from '../scripts/ep01-lib.mjs';
import {scenes as srcScenes} from '../src/data/script.js';

const script = loadScript();

test('script.json 結構與規格', () => {
  const {video} = script.meta;
  assert.deepEqual([video.width, video.height, video.fps, video.durationSeconds, video.durationFrames], [1080, 1920, 30, 60, 1800]);
  assert.equal(script.meta.language, 'zh-TW');
  assert.match(script.meta.disclaimer, /不能取代醫師/);
  assert.ok(script.meta.copyright);
  for (const s of script.scenes) {
    for (const k of ['id', 'title', 'narration', 'subtitle', 'visual', 'transition']) assert.ok(s[k], `${s.id}.${k}`);
    assert.ok(s.keywords.length > 0 && s.points.length > 0);
    assert.match(s.narration, /[一-鿿]/);
  }
  assert.equal(new Set(script.scenes.map((s) => s.id)).size, script.scenes.length);
});

test('時間軸連續、無重疊、涵蓋 0–60 秒', () => {
  let t = 0;
  for (const s of script.scenes) {
    assert.equal(s.startSec, t, `${s.id} 起點應為 ${t}`);
    assert.ok(s.endSec > s.startSec);
    t = s.endSec;
  }
  assert.equal(t, script.meta.video.durationSeconds);
});

test('script.json 與 Remotion 場景資料一致', () => {
  assert.equal(srcScenes.length, script.scenes.length);
  srcScenes.forEach((s, i) => {
    assert.deepEqual([s.id, s.startSec, s.endSec, s.title, s.subtitle], [script.scenes[i].id, script.scenes[i].startSec, script.scenes[i].endSec, script.scenes[i].title, script.scenes[i].subtitle]);
  });
});

test('旁白避免診斷性/絕對化宣稱', () => {
  const all = script.scenes.map((s) => s.narration).join('');
  for (const bad of ['確診', '保證', '治癒', '你得了']) assert.ok(!all.includes(bad), bad);
  assert.ok(!/(?<!不代表)一定會失智/.test(all));
});

test('index.html 含必要控制項並與 script.json 同步', () => {
  const html = fs.readFileSync(path.join(ep, 'index.html'), 'utf8');
  for (const id of ['play', 'pause', 'replay', 'seek', 'scenes', 'cap', 'kw']) assert.ok(html.includes(`id="${id}"`), id);
  assert.ok(html.includes('lang="zh-Hant"'));
  const r = spawnSync('node', ['scripts/ep01-build-html.mjs', '--check'], {cwd: root});
  assert.equal(r.status, 0, r.stderr.toString());
});

test('tts.py 語法正確且 dry-run 可執行', () => {
  const tts = path.join(ep, 'tts.py');
  assert.equal(spawnSync('python3', ['-m', 'py_compile', tts]).status, 0);
  const r = spawnSync('python3', ['-I', tts, '--dry-run']);
  assert.equal(r.status, 0, r.stderr.toString());
  assert.match(r.stdout.toString(), /dry-run/);
});

const probe = (f, entries) => {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', entries, '-of', 'json', f]);
  return r.status === 0 ? JSON.parse(r.stdout) : null;
};
const hasFfprobe = spawnSync('ffprobe', ['-version']).status === 0;

test('sheet_zh.png（若存在）為有效 PNG', {skip: !hasFfprobe || !fs.existsSync(path.join(ep, 'stills/sheet_zh.png'))}, () => {
  const info = probe(path.join(ep, 'stills/sheet_zh.png'), 'stream=width,height,codec_name');
  assert.equal(info.streams[0].codec_name, 'png');
  assert.equal(info.streams[0].width, 1440);
  assert.equal(info.streams[0].height, 1280);
});

test('ep01_zh.mp4（若存在）為 1080x1920 / 30fps / 60 秒', {skip: !hasFfprobe || !fs.existsSync(path.join(ep, 'out/ep01_zh.mp4'))}, () => {
  const info = probe(path.join(ep, 'out/ep01_zh.mp4'), 'stream=codec_name,width,height,r_frame_rate,codec_type:format=duration');
  const v = info.streams.find((s) => s.codec_type === 'video');
  assert.deepEqual([v.width, v.height, v.r_frame_rate], [1080, 1920, '30/1']);
  assert.ok(Math.abs(Number(info.format.duration) - 60) < 0.2);
});
