import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {scenes} from './data/script.js';

const bg = ['#dff5ff', '#ecf3ff', '#f3eeff', '#e8f8f1', '#fff4e3', '#ffecef', '#eaf5ff', '#fff9db'];

const sceneProgress = (frame, scene) => {
  const local = frame - scene.startFrame;
  const duration = scene.endFrame - scene.startFrame;
  if (local < 0 || local > duration) return 0;
  return local / Math.max(duration, 1);
};

const SceneCard = ({scene, frame}) => {
  const {fps} = useVideoConfig();
  const localFrame = frame - scene.startFrame;
  const duration = scene.endFrame - scene.startFrame;

  const inOpacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const outOpacity = interpolate(localFrame, [duration - 12, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cardOpacity = Math.min(inOpacity, outOpacity);

  const rise = interpolate(localFrame, [0, 20], [35, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)
  });

  const pulse = 1 + spring({
    frame: localFrame,
    fps,
    durationInFrames: 22,
    config: {damping: 200, stiffness: 120}
  }) * 0.03;

  return (
    <div
      style={{
        width: 920,
        minHeight: 980,
        margin: '190px auto 0',
        borderRadius: 56,
        background: 'rgba(255,255,255,0.9)',
        border: '3px solid rgba(255,255,255,0.9)',
        boxShadow: '0 24px 70px rgba(48, 66, 106, 0.14)',
        transform: `translateY(${rise}px) scale(${pulse})`,
        opacity: cardOpacity,
        padding: '70px 76px',
        fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
        color: '#183153',
        display: 'flex',
        flexDirection: 'column',
        gap: 26
      }}
    >
      <div style={{fontSize: 86, lineHeight: 1, textAlign: 'center'}}>{scene.icon}</div>
      <div style={{fontSize: 66, lineHeight: 1.2, fontWeight: 800, textAlign: 'center'}}>{scene.title}</div>
      <div
        style={{
          alignSelf: 'center',
          background: '#2f80ed',
          color: '#fff',
          fontSize: 38,
          borderRadius: 999,
          padding: '12px 30px',
          fontWeight: 700
        }}
      >
        {scene.highlight}
      </div>
      <div style={{fontSize: 41, lineHeight: 1.6, textAlign: 'center'}}>{scene.subtitle}</div>
      <div style={{display: 'grid', gap: 16}}>
        {scene.points.map((point) => (
          <div
            key={point}
            style={{
              fontSize: 35,
              lineHeight: 1.5,
              fontWeight: 600,
              borderRadius: 24,
              background: '#f0f7ff',
              padding: '13px 20px',
              textAlign: 'center'
            }}
          >
            {point}
          </div>
        ))}
      </div>
    </div>
  );
};

const BottomSubtitle = ({text, scene, frame}) => {
  const progress = sceneProgress(frame, scene);
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 86,
        borderRadius: 30,
        background: 'rgba(5, 20, 44, 0.78)',
        color: '#fff',
        fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
        fontSize: 40,
        lineHeight: 1.45,
        textAlign: 'center',
        fontWeight: 700,
        padding: '24px 28px',
        opacity
      }}
    >
      {text}
    </div>
  );
};

export const DementiaExplainerVideo = ({audioFile}) => {
  const frame = useCurrentFrame();
  const activeScene = scenes.find((scene) => frame >= scene.startFrame && frame < scene.endFrame) ?? scenes[scenes.length - 1];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${bg[scenes.indexOf(activeScene)]} 0%, #ffffff 100%)`
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginTop: 74,
          fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
          color: '#36507f',
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: '0.06em'
        }}
      >
        什麼是失智症？｜60 秒教學
      </div>

      <SceneCard scene={activeScene} frame={frame} />
      <BottomSubtitle text={activeScene.subtitle} scene={activeScene} frame={frame} />

      {audioFile ? <Audio src={staticFile(audioFile)} /> : null}
    </AbsoluteFill>
  );
};
