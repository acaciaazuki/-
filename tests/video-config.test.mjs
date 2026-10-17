import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIDEO_DURATION_FRAMES,
  VIDEO_DURATION_SECONDS,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH
} from '../src/videoConfig.js';

test('video uses required vertical settings', () => {
  assert.equal(VIDEO_WIDTH, 1080);
  assert.equal(VIDEO_HEIGHT, 1920);
  assert.equal(VIDEO_FPS, 30);
  assert.equal(VIDEO_DURATION_SECONDS, 60);
  assert.equal(VIDEO_DURATION_FRAMES, 1800);
});
