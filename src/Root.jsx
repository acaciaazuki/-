import {Composition} from 'remotion';
import {DementiaExplainerVideo} from './Video.jsx';
import {
  VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH
} from './videoConfig.js';

export const RemotionRoot = () => {
  return (
    <Composition
      id="DementiaExplainer"
      component={DementiaExplainerVideo}
      durationInFrames={VIDEO_DURATION_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{audioFile: null}}
    />
  );
};
